import * as React from 'react';

export default function SessionReminder({ studentName, time, meetingUrl }: { studentName: string, time: string, meetingUrl: string }) {
  return (
    <div>
      <h1>Session Reminder</h1>
      <p>Hi {studentName}, you have a session at {time}.</p>
      <p>Join here: <a href={meetingUrl}>{meetingUrl}</a></p>
    </div>
  );
}
