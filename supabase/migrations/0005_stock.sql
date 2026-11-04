-- Stock notes per category: "mid-December" while waiting on stock, null when
-- in stock. Edited on /admin/stock; every stock mention on the site reads it.
alter table public.categories add column if not exists restock_note text;
update public.categories set restock_note = 'mid-December' where slug in ('cups', 'lids') and restock_note is null;
