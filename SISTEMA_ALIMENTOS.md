# 🍽️ Sistema de Banco de Dados de Alimentos

## 📋 Visão Geral

Sistema completo de gerenciamento de alimentos com banco de dados baseado na **Tabela TACO** (Tabela Brasileira de Composição de Alimentos da UNICAMP), permitindo criar dietas precisas com cálculo automático de macronutrientes.

---

## ✅ O que foi implementado

### Backend

#### 1. **Modelo `Food`** (`backend/models/Food.js`)
- Informações nutricionais completas por 100g
- Campos: calorias, proteínas, carboidratos, gorduras, fibras, sódio
- Categorização (proteína, carboidrato, vegetal, fruta, gordura, laticínio)
- Suporte a alimentos customizados por trainer
- Tags para busca
- Método `calculateMacros(amount, unit)` para cálculo dinâmico

#### 2. **Rotas API** (`backend/routes/foods.js`)
```
GET    /api/foods                    - Listar alimentos (com filtros)
GET    /api/foods/:id                - Buscar por ID
POST   /api/foods                    - Criar alimento customizado
PUT    /api/foods/:id                - Atualizar alimento customizado
DELETE /api/foods/:id                - Deletar alimento customizado
GET    /api/foods/categories/list    - Listar categorias
POST   /api/foods/:id/calculate      - Calcular macros para quantidade
```

#### 3. **Seed com 38 Alimentos** (`backend/seeds/foodsSeed.js`)
Baseado na Tabela TACO:
- **10 Proteínas**: Frango, tilápia, ovo, carne bovina, atum, salmão, feijões, lentilha, grão de bico
- **9 Carboidratos**: Arroz branco/integral, batata doce/inglesa, macarrão, pães, aveia, tapioca
- **5 Vegetais**: Brócolis, alface, tomate, cenoura, couve
- **5 Frutas**: Banana, maçã, mamão, morango, abacate
- **5 Laticínios**: Leite, iogurte, queijos, requeijão
- **4 Gorduras**: Azeite, amendoim, castanhas, amêndoa

#### 4. **Modelo `Diet` Atualizado** (`backend/models/Diet.js`)
- Estrutura de `foodItems` com referência ao banco de alimentos
- Cálculo automático de macros por refeição
- Metas diárias (`goals`)
- Totais calculados automaticamente
- Compatibilidade com campo legado (texto livre)

### Frontend

#### 1. **Serviço de API** (`src/services/api.js`)
```javascript
foodsService.getAll(params)           // Listar com filtros
foodsService.search(search, category) // Buscar
foodsService.getPopular()             // Alimentos populares
foodsService.create(data)             // Criar customizado
foodsService.calculateMacros(id, amount, unit) // Calcular
```

#### 2. **Componente `FoodSearch`** (`src/components/FoodSearch.jsx`)
- Busca com autocomplete
- Filtros por categoria
- Indicador de alimentos populares
- Feedback visual de seleção
- Exibição de macros

---

## 🚀 Como Usar

### 1. Popular o Banco de Dados

```bash
cd backend
node seeds/foodsSeed.js
```

Resultado:
```
✅ 38 alimentos inseridos com sucesso!

📊 Resumo por categoria:
  - proteina: 10 alimentos
  - carboidrato: 9 alimentos
  - vegetal: 5 alimentos
  - lacteo: 5 alimentos
  - fruta: 5 alimentos
  - gordura: 4 alimentos
```

### 2. Usar no Frontend

```jsx
import FoodSearch from '../components/FoodSearch';

// Em um componente
<FoodSearch
  onSelectFood={(food) => {
    console.log('Alimento selecionado:', food);
    // Adicionar à refeição
  }}
  selectedFoods={mealFoods}
/>
```

### 3. Criar Alimento Customizado

```javascript
const newFood = await foodsService.create({
  name: 'Whey Protein',
  category: 'proteina',
  calories: 400,
  protein: 80,
  carbs: 10,
  fat: 5,
  fiber: 0,
  tags: ['suplemento', 'whey', 'proteina']
});
```

### 4. Buscar Alimentos

```javascript
// Buscar por texto
const results = await foodsService.search('frango');

// Buscar por categoria
const proteins = await foodsService.getAll({ category: 'proteina' });

// Buscar populares
const popular = await foodsService.getPopular();
```

### 5. Calcular Macros

```javascript
// Calcular para 150g de frango
const macros = await foodsService.calculateMacros(foodId, 150, 'g');

// Resultado:
{
  calories: 248,
  protein: 46.5,
  carbs: 0,
  fat: 5.4,
  fiber: 0
}
```

---

## 📊 Estrutura de Dados

### Alimento (Food)
```javascript
{
  _id: "...",
  name: "Peito de Frango (grelhado)",
  category: "proteina",
  serving: {
    amount: 100,
    unit: "g"
  },
  calories: 165,
  protein: 31.0,
  carbs: 0,
  fat: 3.6,
  fiber: 0,
  sodium: 63,
  isCustom: false,
  source: "TACO",
  tags: ["frango", "peito", "grelhado", "proteina"],
  popular: true
}
```

### Dieta (Diet) - Nova Estrutura
```javascript
{
  _id: "...",
  student: "studentId",
  name: "Dieta Hipertrofia",
  goals: {
    calories: 2500,
    protein: 150,
    carbs: 300,
    fat: 70
  },
  meals: [
    {
      time: "08:00",
      name: "Café da Manhã",
      foodItems: [
        {
          food: "foodId", // Referência ao Food
          amount: 100,
          unit: "g",
          calculatedMacros: {
            calories: 165,
            protein: 31,
            carbs: 0,
            fat: 3.6
          }
        }
      ],
      totals: {
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6
      }
    }
  ],
  totals: {
    calories: 2450,
    protein: 148,
    carbs: 295,
    fat: 68
  },
  status: "active"
}
```

---

## 🎯 Categorias de Alimentos

| Categoria | Ícone | Exemplos |
|-----------|-------|----------|
| `proteina` | 🥩 | Frango, peixe, carne, ovos, leguminosas |
| `carboidrato` | 🍞 | Arroz, batata, massas, pães, aveia |
| `vegetal` | 🥬 | Brócolis, alface, tomate, cenoura |
| `fruta` | 🍎 | Banana, maçã, mamão, morango |
| `gordura` | 🥑 | Azeite, oleaginosas, abacate |
| `lacteo` | 🥛 | Leite, iogurte, queijos |
| `bebida` | 🥤 | Sucos, chás, etc |
| `outro` | 🍽️ | Outros alimentos |

---

## 🔧 Funcionalidades Avançadas

### 1. Alimentos Populares
Alimentos marcados como `popular: true` aparecem primeiro nas buscas.

### 2. Busca Inteligente
- Busca por nome do alimento
- Busca por tags
- Case-insensitive
- Ordenação: populares primeiro, depois alfabético

### 3. Alimentos Customizados
- Cada trainer pode criar seus próprios alimentos
- Alimentos customizados são privados (apenas o trainer que criou vê)
- Alimentos padrão (TACO) não podem ser editados/deletados

### 4. Cálculo Automático
- Macros calculados automaticamente ao adicionar alimento
- Totais por refeição
- Totais do dia
- Comparação com metas

---

## 📝 Próximos Passos (Opcional)

### Melhorias Futuras:

1. **Mais Alimentos**
   - Expandir seed para 200+ alimentos
   - Adicionar alimentos regionais
   - Suplementos comuns

2. **Receitas**
   - Criar modelo de Receitas
   - Combinar múltiplos alimentos
   - Calcular macros da receita

3. **Substituições**
   - Sugerir substituições equivalentes
   - Ex: "Trocar frango por peixe"

4. **Importação**
   - Importar de APIs externas (USDA, Open Food Facts)
   - Busca por código de barras

5. **Relatórios**
   - Gráficos de distribuição de macros
   - Histórico de dietas
   - Comparação meta vs real

6. **App do Aluno**
   - Marcar refeições como consumidas
   - Tracking de aderência
   - Notificações de horários

---

## 🧪 Testando

### 1. Testar API (Postman/Insomnia)

```bash
# Listar alimentos
GET http://localhost:5000/api/foods

# Buscar por categoria
GET http://localhost:5000/api/foods?category=proteina

# Buscar por texto
GET http://localhost:5000/api/foods?search=frango

# Criar alimento customizado
POST http://localhost:5000/api/foods
{
  "name": "Whey Protein",
  "category": "proteina",
  "calories": 400,
  "protein": 80,
  "carbs": 10,
  "fat": 5
}
```

### 2. Testar no Frontend

1. Abra a página de Dietas
2. Use o componente `<FoodSearch />`
3. Busque alimentos
4. Filtre por categoria
5. Adicione à refeição

---

## 📚 Referências

- **Tabela TACO**: https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf
- **USDA FoodData Central**: https://fdc.nal.usda.gov/
- **Open Food Facts**: https://world.openfoodfacts.org/

---

## ✅ Checklist de Implementação

- [x] Modelo Food criado
- [x] Rotas CRUD implementadas
- [x] Seed com 38 alimentos
- [x] Modelo Diet atualizado
- [x] Serviço frontend criado
- [x] Componente FoodSearch criado
- [ ] Integração com página de Dietas
- [ ] Testes E2E
- [ ] Documentação de uso para trainers

---

**Sistema pronto para uso! 🎉**

Para integrar na página de Dietas, basta importar o componente `FoodSearch` e usar os métodos do `foodsService`.
