import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000/api';
const WELLHUB_API_KEY = process.env.WELLHUB_API_KEY || 'test_api_key';

// Cores para console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`)
};

let accessToken = '';
let jwtToken = '';
const testGympassUserId = `gpw-test-${Date.now()}`;

// Função auxiliar para fazer requisições
async function makeRequest(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
}

// Teste 1: Obter Access Token
async function testGetAccessToken() {
  log.title('📝 Teste 1: Obter Access Token');
  
  const result = await makeRequest('GET', '/wellhub/auth', null, {
    'X-Api-Key': WELLHUB_API_KEY
  });

  if (result.success) {
    accessToken = result.data.access_token;
    log.success(`Token obtido: ${accessToken.substring(0, 20)}...`);
    log.info(`Tipo: ${result.data.token_type}`);
    log.info(`Expira em: ${new Date(result.data.expires_at * 1000).toLocaleString()}`);
    return true;
  } else {
    log.error(`Falha ao obter token: ${JSON.stringify(result.error)}`);
    return false;
  }
}

// Teste 2: Registrar Usuário
async function testRegisterUser() {
  log.title('📝 Teste 2: Registrar Usuário');

  const userData = {
    gympass_user_id: testGympassUserId,
    email: `teste-${Date.now()}@wellhub.com`,
    first_name: 'João',
    last_name: 'Teste',
    origin: 'web',
    user_status: '1',
    country_code: 'br'
  };

  const result = await makeRequest('POST', '/wellhub/register', userData, {
    'Authorization': `Bearer ${accessToken}`
  });

  if (result.success) {
    log.success('Usuário registrado com sucesso');
    log.info(`Redirect Link: ${result.data.redirect_link}`);
    log.info(`Usuário existente: ${result.data.existing_user}`);
    return true;
  } else {
    log.error(`Falha ao registrar: ${JSON.stringify(result.error)}`);
    return false;
  }
}

// Teste 3: Fazer Login e Obter JWT
async function testLogin() {
  log.title('📝 Teste 3: Fazer Login (obter JWT)');
  
  // Aqui você precisa usar credenciais válidas de um trainer
  const loginData = {
    email: process.env.TEST_TRAINER_EMAIL || 'wagner@gmail.com',
    password: process.env.TEST_TRAINER_PASSWORD || '123456'
  };

  const result = await makeRequest('POST', '/auth/login', loginData);

  if (result.success) {
    jwtToken = result.data.token;
    log.success(`Login realizado com sucesso`);
    log.info(`JWT Token: ${jwtToken.substring(0, 20)}...`);
    return true;
  } else {
    log.error(`Falha no login: ${JSON.stringify(result.error)}`);
    log.warn('Configure TEST_TRAINER_EMAIL e TEST_TRAINER_PASSWORD no .env');
    return false;
  }
}

// Teste 4: Listar Usuários Wellhub
async function testListUsers() {
  log.title('📝 Teste 4: Listar Usuários Wellhub');

  const result = await makeRequest('GET', '/wellhub/users', null, {
    'Authorization': `Bearer ${jwtToken}`
  });

  if (result.success) {
    log.success(`${result.data.count} usuários encontrados`);
    if (result.data.data.length > 0) {
      log.info(`Primeiro usuário: ${result.data.data[0].firstName} ${result.data.data[0].lastName}`);
    }
    return true;
  } else {
    log.error(`Falha ao listar: ${JSON.stringify(result.error)}`);
    return false;
  }
}

// Teste 5: Obter Detalhes do Usuário
async function testGetUserDetails() {
  log.title('📝 Teste 5: Obter Detalhes do Usuário');

  const result = await makeRequest('GET', `/wellhub/users/${testGympassUserId}`, null, {
    'Authorization': `Bearer ${jwtToken}`
  });

  if (result.success) {
    log.success('Detalhes do usuário obtidos');
    log.info(`Nome: ${result.data.data.firstName} ${result.data.data.lastName}`);
    log.info(`Email: ${result.data.data.email}`);
    log.info(`Check-ins: ${result.data.data.totalCheckIns}`);
    return true;
  } else {
    log.error(`Falha ao obter detalhes: ${JSON.stringify(result.error)}`);
    return false;
  }
}

// Teste 6: Registrar Check-in
async function testRegisterCheckIn() {
  log.title('📝 Teste 6: Registrar Check-in');

  const checkInData = {
    gympass_user_id: testGympassUserId,
    origin: 'web',
    notes: 'Check-in de teste automático'
  };

  const result = await makeRequest('POST', '/wellhub/checkin', checkInData, {
    'Authorization': `Bearer ${jwtToken}`
  });

  if (result.success) {
    log.success('Check-in registrado com sucesso');
    log.info(`Total de check-ins: ${result.data.checkIn.totalCheckIns}`);
    log.info(`Data: ${new Date(result.data.checkIn.date).toLocaleString()}`);
    return true;
  } else {
    log.error(`Falha ao registrar check-in: ${JSON.stringify(result.error)}`);
    return false;
  }
}

// Teste 7: Obter Estatísticas
async function testGetStats() {
  log.title('📝 Teste 7: Obter Estatísticas');

  const result = await makeRequest('GET', '/wellhub/stats', null, {
    'Authorization': `Bearer ${jwtToken}`
  });

  if (result.success) {
    log.success('Estatísticas obtidas');
    log.info(`Total de usuários: ${result.data.data.totalUsers}`);
    log.info(`Total de check-ins: ${result.data.data.totalCheckIns}`);
    log.info(`Usuários ativos: ${result.data.data.activeUsers}`);
    return true;
  } else {
    log.error(`Falha ao obter estatísticas: ${JSON.stringify(result.error)}`);
    return false;
  }
}

// Teste 8: Testes de Erro
async function testErrors() {
  log.title('📝 Teste 8: Testes de Erro');

  // Erro: API Key inválida
  log.info('Testando API Key inválida...');
  let result = await makeRequest('GET', '/wellhub/auth', null, {
    'X-Api-Key': 'chave_invalida'
  });
  if (result.status === 403) {
    log.success('Erro 403 retornado corretamente');
  } else {
    log.error('Deveria retornar 403');
  }

  // Erro: Token ausente
  log.info('Testando token ausente...');
  result = await makeRequest('POST', '/wellhub/register', {
    gympass_user_id: 'test'
  });
  if (result.status === 401) {
    log.success('Erro 401 retornado corretamente');
  } else {
    log.error('Deveria retornar 401');
  }

  // Erro: gympass_user_id ausente
  log.info('Testando gympass_user_id ausente...');
  result = await makeRequest('POST', '/wellhub/checkin', {
    origin: 'web'
  }, {
    'Authorization': `Bearer ${jwtToken}`
  });
  if (result.status === 400) {
    log.success('Erro 400 retornado corretamente');
  } else {
    log.error('Deveria retornar 400');
  }

  return true;
}

// Executar todos os testes
async function runAllTests() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║  TESTES DA API WELLHUB - POWER TRAINING ║');
  console.log('╚════════════════════════════════════════╝\n');

  log.info(`Base URL: ${BASE_URL}`);
  log.info(`Test Gympass ID: ${testGympassUserId}\n`);

  const results = {
    passed: 0,
    failed: 0
  };

  // Executar testes em sequência
  const tests = [
    { name: 'Get Access Token', fn: testGetAccessToken },
    { name: 'Register User', fn: testRegisterUser },
    { name: 'Login', fn: testLogin },
    { name: 'List Users', fn: testListUsers },
    { name: 'Get User Details', fn: testGetUserDetails },
    { name: 'Register Check-in', fn: testRegisterCheckIn },
    { name: 'Get Stats', fn: testGetStats },
    { name: 'Error Tests', fn: testErrors }
  ];

  for (const test of tests) {
    const success = await test.fn();
    if (success) {
      results.passed++;
    } else {
      results.failed++;
    }
    await new Promise(resolve => setTimeout(resolve, 500)); // Delay entre testes
  }

  // Resumo
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║           RESUMO DOS TESTES            ║');
  console.log('╚════════════════════════════════════════╝\n');
  log.success(`Testes aprovados: ${results.passed}`);
  if (results.failed > 0) {
    log.error(`Testes falhados: ${results.failed}`);
  }
  console.log(`\nTotal: ${results.passed + results.failed} testes\n`);

  process.exit(results.failed > 0 ? 1 : 0);
}

// Executar
runAllTests().catch(error => {
  log.error(`Erro fatal: ${error.message}`);
  process.exit(1);
});
