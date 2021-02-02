const SPREADSHEET_ID = 'xxxxxxxxxx'
const SHEET_NAME = 'State'
const ACTIVE_CELL = 'B1'
const SLEEPING_CELL = 'B2'

const HOLIDAY_CALENDAR_ID = 'ja.japanese#holiday@group.v.calendar.google.com'
const IFTTT_WEBHOOK_URL = 'https://maker.ifttt.com/trigger/event-name/with/key/xxxxxxxxxx'

const TRIGGER_HOURS = 10
const TRIGGER_MINUTES = 50

function wakeUp(e) {
  if (e && e.triggerUid) {
    deleteTrigger(e.triggerUid)
  }

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME)
  const isActive = sheet.getRange(ACTIVE_CELL).getValue() === '1'
  const isSleeping = sheet.getRange(SLEEPING_CELL).getValue() === '1'

  if (isActive && isSleeping && isWeekday()) {
    UrlFetchApp.fetch(IFTTT_WEBHOOK_URL, { method: 'post' })
  }
}

function isWeekday() {
  const today = new Date()
  const dayOfWeek = today.getDay()

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false
  }

  const calendar = CalendarApp.getCalendarById(HOLIDAY_CALENDAR_ID)
  const events = calendar.getEventsForDay(today)

  if (events.length) {
    return false
  }

  return true
}

function createTrigger() {
  const today = new Date()

  today.setHours(TRIGGER_HOURS)
  today.setMinutes(TRIGGER_MINUTES)

  ScriptApp.newTrigger('wakeUp').timeBased().at(today).create()
}

function deleteTrigger(triggerId) {
  const triggers = ScriptApp.getProjectTriggers()

  triggers.forEach(trigger => {
    if (trigger.getUniqueId() === triggerId) {
      ScriptApp.deleteTrigger(trigger)
    }
  })
}