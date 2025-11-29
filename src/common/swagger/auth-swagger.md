# Auth API

Hier findest du alle Endpunkte für die Authentifizierung:

- `POST /auth/register` → Registriert einen neuen Benutzer  
- `POST /auth/login` → Gibt ein JWT-Token zurück  
- `GET /auth/me` → Gibt das eingeloggte Benutzerprofil zurück  

💡 Hinweis: Du musst nach dem Login den `Authorize`-Button oben in Swagger verwenden,  
um das JWT-Token zu aktivieren.
