import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { loadMarkdown } from './swagger-markdown.util';

const authDoc = loadMarkdown('auth-swagger.md');
const tasksDoc = loadMarkdown('tasks-swagger.md');
const usersDoc = loadMarkdown('users-swagger.md');

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Task API')
  .setDescription(
    `
  <div class="markdown-body">
  <h1>Task API Dokumentation</h1>
  </hr>
   ${authDoc}
  </div>
  <div class="markdown-body">
   ${tasksDoc}
  </div>
  <div class="markdown-body">
   ${usersDoc}
  </div>
`,
  )
  .setVersion('1.0.0')
  .addServer('http://localhost:3000', 'Lokale Entwicklung')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      description: 'JWT Token hier einfügen',
    },
    'JWT-auth',
  )
  .build();

export const swaggerCustomOptions: SwaggerCustomOptions = {
  customSiteTitle: 'Task API – Swagger',
  customCss: `
    .swagger-ui .topbar { background-color: #e0234e; }
    .topbar-wrapper img {content:url('https://nestjs.com/img/logo-small.svg'); width:50px; height:auto;}
    .markdown-body h1, .markdown-body h2, .markdown-body h3 { color: #333; }
    .markdown-body p, .markdown-body li { font-size: 15px; line-height: 1.6; }
  `,
  customfavIcon: 'https://nestjs.com/img/logo-small.svg',
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'none',
    defaultModelsExpandDepth: -1,
    syntaxHighlight: { activated: true },
    displayRequestDuration: true,
  },
};
