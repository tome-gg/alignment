```
CREATE OR REPLACE FUNCTION log_entry_update() RETURNS TRIGGER AS $$
BEGIN
  -- Insert the updated row into the entries_eventlog table
  INSERT INTO entries_eventlog (
    entry_type,
    contents,
    journal_id,
    sort_id,
    metadata,
    source_id
  ) VALUES (
    NEW.entry_type,
    NEW.contents,
    NEW.journal_id,
    NEW.sort_id,
    NEW.metadata,
    OLD.id
  );

  -- Return the new row to proceed with the update on the entries table
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

```

and

```
CREATE TRIGGER trigger_log_entry_update
AFTER UPDATE ON entries
FOR EACH ROW
EXECUTE FUNCTION log_entry_update();
```