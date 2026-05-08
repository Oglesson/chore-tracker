# Chore Tracker TODO

- Child is shown a congratulations animation when the points target is hit. Excess points roll over to the next target. A numerical 'rewards due' is recorded then approved by the parent when implemented offline
- Make more fun and visually appealing in the childrens view - give a visual representation of progress like a bar or a circle with a percentage coloured in
- Add a login screen - roles are assigned to each user so the appropriate initial screen is displayed. Parents can see a kids view but not the other way around.
- Set reminders for chores that are regular - maybe create two categories of chore -scheduled and as and when
- validation on chores so there are no dupes - the search for a duplicate is a fuzzy search so it recognises similar but not exact same entries
- push notifications to:
  - alert parent that chores need approving if not approved in a day and then repeated push notifications every day untik approved
  - alert a parent that a points target has been reached and to implement the reward (offline)
  - alert a child when their points target has incraesed, giving the number of points left until there's a reward

## Nice To Haves

- Timed reminders for children to do chores - deadlines set by parents. For regular tasks, this might need a schedule. Tasks could be categorised as freqent or one offs/infrequent
- Be able to set actual financial reward limits per points target and use a financial api to conduct/start a transfer between accounts - this carries quite high security risks so will need some consideration.
