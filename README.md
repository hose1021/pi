# Pi config

Персональный конфиг [pi](https://github.com/earendil-works/pi-coding-agent).

## Структура

- `agent/` — активный глобальный конфиг Pi (`~/.pi/agent`): настройки, правила, расширения и темы.
- `.doom/` — конфиг DoomPi.
- Остальные runtime-данные Pi исключены через `.gitignore`.

## Установка

```bash
git clone git@github.com:hose1021/pi.git ~/.pi
pi update --extensions
```

Если `~/.pi` уже существует, сначала сохраните `~/.pi/agent/auth.json`, затем объедините каталог вручную.

## Обновление

```bash
git -C ~/.pi pull --rebase
pi update --extensions
```

Изменения синхронизируются обычными Git-коммитами. Автоматический stash/commit/push намеренно не используется: конфликты должны быть видимыми.

## Не коммитить

Секреты, сессии, установленные npm/git-пакеты, кеши, логи и runtime-статистику. Актуальный список находится в `.gitignore`.
