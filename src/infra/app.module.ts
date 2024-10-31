import { Module } from '@nestjs/common' // Importa o decorador 'Module' do Nest.js para definir um módulo
import { ConfigModule } from '@nestjs/config' // Importa o módulo de configuração para gerenciar variáveis de ambiente
import { envSchema } from './env/env' // Importa o esquema de validação para verificar as variáveis de ambiente
import { authModule } from './auth/auth.module'

import { HttpModule } from './http/http.module'
import { EnvModule } from './env/env.module'
import { EventsModule } from './events/events.module'

@Module({
  imports: [
    // ConfigModule para gerenciar e validar as variáveis de ambiente
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env), // Valida as variáveis de ambiente usando o 'envSchema'
      isGlobal: true, // Define o módulo de configuração como global para ser acessível em toda a aplicação
    }),
    // autenticação
    authModule,
    HttpModule, // Módulo onde estão localizados os controllers
    EnvModule,
    EventsModule,
  ],
})
export class AppModule {}
