-- Der Gleichgewichts-Code: program grows from 22 to 90 days.
-- workout_overrides day 0 holds program-wide settings (base exercise video).
alter table completions drop constraint if exists completions_day_check;
alter table completions add constraint completions_day_check check (day between 1 and 90);

alter table workout_overrides drop constraint if exists workout_overrides_day_check;
alter table workout_overrides add constraint workout_overrides_day_check check (day between 0 and 90);
