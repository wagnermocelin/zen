# 📋 Como Adicionar Mais Alimentos da Tabela TACO

## 🎯 Objetivo
Expandir o banco de dados de alimentos de 38 para 200+ alimentos da Tabela TACO.

---

## 📚 Fonte de Dados

**Tabela TACO (4ª Edição)**: https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf

---

## 🔧 Como Adicionar Novos Alimentos

### 1. **Editar o arquivo de seed**
```bash
backend/seeds/foodsSeed.js
```

### 2. **Formato do alimento**
```javascript
{
  name: 'Nome do Alimento (preparação)',
  category: 'proteina', // ou carboidrato, vegetal, fruta, gordura, lacteo
  calories: 100,        // kcal por 100g
  protein: 20.0,        // g por 100g
  carbs: 10.0,          // g por 100g
  fat: 5.0,             // g por 100g
  fiber: 2.0,           // g por 100g
  sodium: 50,           // mg por 100g
  popular: true,        // opcional - destaca o alimento
  tags: ['tag1', 'tag2', 'tag3'] // para busca
}
```

### 3. **Executar o seed**
```bash
cd backend
node seeds/foodsSeed.js
```

---

## 📊 Categorias Principais da TACO

### 🥩 Carnes e Derivados
- Carnes bovinas (acém, alcatra, contrafilé, costela, cupim, filé mignon, patinho, picanha)
- Carnes suínas (bisteca, costela, lombo, pernil)
- Aves (frango, peru, pato, chester)
- Embutidos (linguiça, salsicha, presunto, mortadela, salame)

### 🐟 Peixes e Frutos do Mar
- Peixes de água doce (tilápia, pacu, pintado, tambaqui)
- Peixes de água salgada (atum, bacalhau, merluza, pescada, salmão, sardinha)
- Frutos do mar (camarão, lagosta, lula, polvo, ostra, mexilhão)

### 🥚 Ovos
- Ovo de galinha (inteiro, clara, gema)
- Ovo de codorna

### 🥛 Leite e Derivados
- Leites (integral, desnatado, semidesnatado, em pó)
- Iogurtes (natural, grego, desnatado)
- Queijos (minas, mussarela, prato, parmesão, ricota, cottage, cheddar)
- Requeijão, manteiga, creme de leite

### 🌾 Cereais e Derivados
- Arroz (branco, integral, parboilizado)
- Massas (macarrão, espaguete, penne, lasanha)
- Pães (francês, integral, forma, bisnaga, pão de queijo)
- Farinhas (trigo, milho, mandioca, aveia, centeio)
- Cereais matinais (aveia, granola, corn flakes)

### 🥔 Tubérculos e Raízes
- Batatas (inglesa, doce, baroa)
- Mandioca (aipim, macaxeira)
- Inhame, cará, mandioquinha

### 🫘 Leguminosas
- Feijões (preto, carioca, branco, fradinho, azuki)
- Lentilha, grão de bico, ervilha
- Soja e derivados (tofu, leite de soja, proteína texturizada)

### 🥬 Verduras e Legumes
- Folhosos (alface, rúcula, agrião, couve, espinafre, acelga)
- Crucíferas (brócolis, couve-flor, repolho)
- Raízes (cenoura, beterraba, rabanete)
- Outros (tomate, pepino, abobrinha, berinjela, pimentão, chuchu)

### 🍎 Frutas
- Cítricas (laranja, limão, tangerina, mexerica)
- Tropicais (banana, mamão, manga, abacaxi, coco, maracujá)
- Berries (morango, amora, framboesa, mirtilo)
- Outras (maçã, pera, uva, melancia, melão, kiwi, pêssego)

### 🥑 Oleaginosas e Sementes
- Castanhas (caju, pará, do Brasil)
- Nozes, amêndoas, avelãs
- Sementes (chia, linhaça, gergelim, girassol, abóbora)
- Amendoim

### 🫒 Óleos e Gorduras
- Óleos vegetais (oliva, soja, canola, girassol, milho)
- Azeite de oliva
- Manteiga, margarina

### 🍬 Açúcares e Doces
- Açúcares (cristal, refinado, mascavo, demerara)
- Mel, melado, rapadura
- Doces (goiabada, marmelada, doce de leite)

### 🥤 Bebidas
- Sucos naturais
- Refrigerantes
- Chás, café
- Bebidas lácteas

---

## 🎯 Prioridade de Adição

### Alta Prioridade (Mais Usados)
1. ✅ Carnes bovinas principais (patinho, alcatra, filé mignon) - **FEITO**
2. ✅ Frango (peito, coxa) - **FEITO**
3. ✅ Peixes (tilápia, salmão, atum) - **FEITO**
4. ✅ Ovos - **FEITO**
5. ✅ Arroz (branco, integral) - **FEITO**
6. ✅ Batatas (doce, inglesa) - **FEITO**
7. ✅ Feijões (preto, carioca) - **FEITO**
8. ✅ Leite e iogurte - **FEITO**
9. ✅ Pães (francês, integral) - **FEITO**
10. ✅ Vegetais básicos (brócolis, alface, tomate) - **FEITO**

### Média Prioridade
11. Carnes suínas (lombo, bisteca, pernil)
12. Mais peixes (pescada, merluza, sardinha)
13. Queijos variados (mussarela, prato, ricota)
14. Massas (macarrão, lasanha)
15. Mais vegetais (cenoura, abobrinha, berinjela)
16. Mais frutas (laranja, manga, melancia)
17. Oleaginosas (castanhas, nozes)

### Baixa Prioridade
18. Embutidos
19. Doces e sobremesas
20. Bebidas
21. Temperos e condimentos

---

## 📝 Exemplo de Adição em Lote

```javascript
// Adicionar ao array foods[] no foodsSeed.js

// CARNES SUÍNAS
{
  name: 'Carne Suína (Lombo, assado)',
  category: 'proteina',
  calories: 221,
  protein: 27.4,
  carbs: 0,
  fat: 11.8,
  fiber: 0,
  sodium: 49,
  popular: true,
  tags: ['carne', 'porco', 'lombo', 'assado']
},
{
  name: 'Carne Suína (Bisteca, grelhada)',
  category: 'proteina',
  calories: 273,
  protein: 23.8,
  carbs: 0,
  fat: 19.2,
  fiber: 0,
  sodium: 58,
  tags: ['carne', 'porco', 'bisteca', 'grelhada']
},

// QUEIJOS
{
  name: 'Queijo Mussarela',
  category: 'lacteo',
  calories: 289,
  protein: 25.4,
  carbs: 3.6,
  fat: 19.5,
  fiber: 0,
  sodium: 682,
  popular: true,
  tags: ['queijo', 'mussarela']
},
{
  name: 'Queijo Ricota',
  category: 'lacteo',
  calories: 140,
  protein: 11.3,
  carbs: 3.4,
  fat: 9.5,
  fiber: 0,
  sodium: 300,
  popular: true,
  tags: ['queijo', 'ricota']
},
```

---

## ✅ Status Atual

**Alimentos no banco: 38**

### Distribuição:
- Proteínas: 10
- Carboidratos: 9
- Vegetais: 5
- Frutas: 5
- Laticínios: 5
- Gorduras: 4

**Meta: 200+ alimentos**

---

## 🚀 Próximos Passos

1. **Fase 1** (50 alimentos): Adicionar carnes suínas, mais peixes, queijos
2. **Fase 2** (100 alimentos): Adicionar mais vegetais, frutas, massas
3. **Fase 3** (150 alimentos): Adicionar oleaginosas, doces, bebidas
4. **Fase 4** (200+ alimentos): Completar com alimentos regionais e especiais

---

## 📞 Suporte

Se precisar de ajuda para adicionar alimentos, me chame! Posso:
- Buscar valores nutricionais na tabela TACO
- Formatar os dados no padrão correto
- Executar o seed
- Verificar se os alimentos foram adicionados

**Vamos expandir o banco de dados gradualmente! 🎯**
