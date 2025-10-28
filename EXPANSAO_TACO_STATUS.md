# 📊 Status da Expansão da Tabela TACO

## ✅ Implementação Atual

**Total de Alimentos: 241**

### Distribuição por Categoria:
- 🥩 Proteínas: 68 alimentos (28%)
- 🥬 Vegetais: 54 alimentos (22%)
- 🍞 Carboidratos: 39 alimentos (16%)
- 🍎 Frutas: 38 alimentos (16%)
- 🥑 Gorduras: 21 alimentos (9%)
- 🥛 Laticínios: 14 alimentos (6%)
- 🥤 Bebidas: 7 alimentos (3%)

---

## 🎯 Meta: Tabela TACO Completa (597 alimentos)

### Progresso: 40% (241/597)

---

## 📋 Categorias Já Implementadas (Completas ou Parciais):

### ✅ Bem Cobertas (>70%):
- Carnes Bovinas (principais cortes)
- Carnes Suínas (principais cortes)
- Aves (frango e peru)
- Peixes Comuns (tilápia, salmão, atum, etc)
- Ovos
- Feijões
- Arroz
- Massas
- Pães Básicos
- Batatas
- Frutas Comuns
- Vegetais Folhosos
- Oleaginosas Principais

### 🟡 Parcialmente Cobertas (30-70%):
- Frutos do Mar (camarão, mas faltam: lagosta, lula, polvo, ostra, mexilhão)
- Embutidos (linguiça, presunto, mas faltam: salame, copa, paio)
- Queijos (5 tipos, mas faltam: cheddar, provolone, gorgonzola, etc)
- Biscoitos (4 tipos, mas faltam muitos)
- Cereais Matinais (2 tipos, mas faltam vários)
- Doces e Sobremesas (poucos)

### 🔴 Pouco Cobertas ou Ausentes (<30%):
- Carnes Exóticas (cordeiro, cabrito, coelho, javali, pato)
- Vísceras (fígado, coração, rim, língua, bucho)
- Peixes Regionais (pacu, pintado, tambaqui, dourado)
- Frutas Regionais (cupuaçu, graviola, jabuticaba, caj, pitanga)
- Temperos e Condimentos
- Molhos
- Alimentos Industrializados
- Preparações Típicas (feijoada, moqueca, etc)
- Bebidas Alcoólicas
- Sucos Industrializados

---

## 🚀 Próximas Expansões Sugeridas:

### Fase 5 (350 alimentos) - Prioridade Alta:
**+109 alimentos**

#### Proteínas (+30):
- Frutos do Mar: Lagosta, Lula, Polvo, Ostra, Mexilhão, Marisco
- Embutidos: Salame, Copa, Paio, Apresuntado
- Carnes Especiais: Cordeiro, Cabrito, Coelho, Pato
- Vísceras: Fígado (boi/frango/porco), Coração, Moela, Língua

#### Laticínios (+15):
- Queijos: Cheddar, Provolone, Gorgonzola, Brie, Camembert, Cream Cheese, Requeijão
- Leites: Leite condensado, Leite em pó, Leite de cabra
- Outros: Nata, Chantilly

#### Frutas (+20):
- Regionais: Cupuaçu, Graviola, Jabuticaba, Caju, Pitanga, Açaí (mais variedades)
- Importadas: Amora, Cereja, Damasco, Figo, Lichia, Romã
- Secas: Tâmara, Uva passa, Damasco seco

#### Vegetais (+15):
- Cogumelos: Shiitake, Shimeji, Paris, Portobello
- Outros: Aspargo, Alcachofra, Berinjela japonesa, Abobrinha japonesa
- Folhas: Rúcula selvagem, Agrião d'água, Mostarda

#### Carboidratos (+20):
- Biscoitos: Wafer, Recheado, Maria, Rosquinha, Polvilho
- Bolos: Chocolate, Fubá, Cenoura, Laranja
- Pães: Ciabatta, Baguete, Croissant, Brioche
- Outros: Cuscuz, Farofa, Pamonha

#### Bebidas (+5):
- Sucos: Uva, Maracujá, Abacaxi, Limão
- Chás: Verde, Branco, Hibisco

#### Gorduras (+4):
- Sementes: Gergelim, Papoula
- Outros: Tahine, Pasta de amendoim

---

### Fase 6 (450 alimentos) - Prioridade Média:
**+100 alimentos**

- Preparações Típicas Brasileiras
- Molhos e Condimentos
- Alimentos Industrializados
- Sobremesas
- Snacks e Petiscos
- Bebidas Alcoólicas

---

### Fase 7 (550+ alimentos) - Prioridade Baixa:
**+100+ alimentos**

- Alimentos Regionais Específicos
- Preparações Complexas
- Fast Food
- Alimentos Étnicos
- Complementos Nutricionais

---

## 💡 Recomendação:

Para um sistema profissional completo, recomendo implementar a **Fase 5 (350 alimentos)**.

Isso daria:
- ✅ Cobertura de 59% da TACO completa
- ✅ Todos os alimentos comuns do dia a dia
- ✅ Opções para dietas especiais
- ✅ Variedade suficiente para qualquer tipo de planejamento

---

## 🔧 Como Expandir:

1. Editar `backend/seeds/generateTacoComplete.js`
2. Adicionar novos alimentos no formato:
   ```
   Nome do Alimento|categoria|calorias|proteina|carbs|gordura|fibra|sodio|popular
   ```
3. Executar: `node generateTacoComplete.js`
4. Executar: `node foodsSeedFromJson.js`

---

## 📚 Fonte de Dados:

**Tabela TACO 4ª Edição**
- PDF: https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf
- Total de Alimentos: 597
- Implementados: 241 (40%)

---

**Última Atualização: 28/10/2025**
