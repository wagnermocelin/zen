import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Config from '../models/Config.js';

dotenv.config();

const updateConfigDefaults = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado:', mongoose.connection.host);
    console.log('📦 Database:', mongoose.connection.name);

    console.log('\n🔄 Atualizando configurações padrão...\n');

    // Buscar todas as configurações
    const configs = await Config.find({});
    console.log(`📋 Encontradas ${configs.length} configurações para atualizar\n`);

    let updated = 0;
    let skipped = 0;

    for (const config of configs) {
      let needsUpdate = false;
      const updates = {};

      // Atualizar gymName se ainda estiver com valor antigo
      if (config.gymName === 'Zen' || !config.gymName) {
        updates.gymName = 'Power Training';
        needsUpdate = true;
        console.log(`📝 Atualizando gymName: "${config.gymName}" → "Power Training"`);
      }

      // Atualizar emailConfig se necessário
      if (config.emailConfig) {
        // Atualizar fromName
        if (config.emailConfig.fromName === 'Zen Personal Trainer' || !config.emailConfig.fromName) {
          if (!updates.emailConfig) updates.emailConfig = { ...config.emailConfig };
          updates.emailConfig.fromName = 'Power Training';
          needsUpdate = true;
          console.log(`📧 Atualizando fromName: "${config.emailConfig.fromName}" → "Power Training"`);
        }

        // Atualizar fromEmail
        if (config.emailConfig.fromEmail === 'noreply@zen.com') {
          if (!updates.emailConfig) updates.emailConfig = { ...config.emailConfig };
          updates.emailConfig.fromEmail = 'noreply@powertraining.com';
          needsUpdate = true;
          console.log(`📧 Atualizando fromEmail: "${config.emailConfig.fromEmail}" → "noreply@powertraining.com"`);
        }

        // Atualizar templates de email
        if (config.emailConfig.emailTemplates) {
          if (config.emailConfig.emailTemplates.welcomeSubject?.includes('Zen')) {
            if (!updates.emailConfig) updates.emailConfig = { ...config.emailConfig };
            if (!updates.emailConfig.emailTemplates) updates.emailConfig.emailTemplates = { ...config.emailConfig.emailTemplates };
            updates.emailConfig.emailTemplates.welcomeSubject = 'Bem-vindo ao Power Training - Ative sua conta';
            needsUpdate = true;
            console.log(`📧 Atualizando welcomeSubject`);
          }

          if (config.emailConfig.emailTemplates.resetPasswordSubject?.includes('Zen')) {
            if (!updates.emailConfig) updates.emailConfig = { ...config.emailConfig };
            if (!updates.emailConfig.emailTemplates) updates.emailConfig.emailTemplates = { ...config.emailConfig.emailTemplates };
            updates.emailConfig.emailTemplates.resetPasswordSubject = 'Redefinir Senha - Power Training';
            needsUpdate = true;
            console.log(`📧 Atualizando resetPasswordSubject`);
          }
        }
      }

      if (needsUpdate) {
        await Config.findByIdAndUpdate(config._id, updates);
        updated++;
        console.log(`✅ Configuração atualizada (ID: ${config._id})\n`);
      } else {
        skipped++;
        console.log(`⏭️  Configuração já está atualizada (ID: ${config._id})\n`);
      }
    }

    console.log('\n📊 Resumo da atualização:');
    console.log(`  ✅ Atualizadas: ${updated}`);
    console.log(`  ⏭️  Ignoradas: ${skipped}`);
    console.log(`  📋 Total: ${configs.length}`);

    console.log('\n🎉 Atualização de configurações concluída com sucesso!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao atualizar configurações:', error);
    process.exit(1);
  }
};

updateConfigDefaults();
