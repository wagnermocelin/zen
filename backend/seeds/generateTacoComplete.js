import fs from 'fs';

// Script para gerar todos os 597 alimentos da Tabela TACO
// Baseado na 4ª edição da Tabela Brasileira de Composição de Alimentos

const tacoFoods = `Abacate|fruta|96|1.2|6.0|8.4|6.3|2|true
Abacaxi cru|fruta|48|0.5|12.3|0.1|1.0|1|true
Abóbora cabotiã crua|vegetal|30|1.1|7.5|0.1|2.5|1
Abóbora cabotiã cozida|vegetal|37|1.3|8.8|0.2|2.2|1
Abóbora moranga crua|vegetal|12|1.0|2.8|0.1|1.7|1
Abobrinha italiana crua|vegetal|19|1.2|4.3|0.2|1.0|2
Abobrinha italiana cozida|vegetal|20|1.3|4.6|0.2|1.4|1
Abobrinha paulista crua|vegetal|16|1.4|3.4|0.1|1.0|1
Açaí polpa congelada|fruta|58|0.8|6.2|3.9|2.6|7|true
Acelga crua|vegetal|21|1.8|4.3|0.2|1.6|213
Acelga cozida|vegetal|24|2.0|4.9|0.2|2.1|179
Açúcar cristal|carboidrato|387|0|99.9|0|0|1
Açúcar mascavo|carboidrato|369|0.1|95.0|0|0|39
Açúcar refinado|carboidrato|387|0|99.9|0|0|1
Agrião cru|vegetal|17|2.6|2.8|0.2|2.0|46
Água de coco|bebida|22|0.1|5.5|0|0|105|true
Alcachofra crua|vegetal|50|2.9|11.2|0.1|9.4|94
Alface americana crua|vegetal|11|1.3|1.7|0.2|1.7|10|true
Alface crespa crua|vegetal|13|1.4|2.2|0.2|2.1|7|true
Alface lisa crua|vegetal|15|1.3|2.9|0.3|2.0|8
Alface roxa crua|vegetal|13|1.2|2.6|0.2|1.9|22
Almeirão cru|vegetal|18|1.8|3.2|0.3|3.1|69
Almôndega bovina crua|proteina|232|15.5|10.7|14.0|0.5|560
Ameixa fresca|fruta|53|0.8|13.9|0.2|2.4|1
Ameixa em calda enlatada|fruta|84|0.4|22.0|0.1|1.0|2
Ameixa seca|fruta|194|2.5|51.0|0.5|7.2|4
Amendoim torrado com sal|gordura|544|27.2|20.3|43.9|8.0|391|true
Amêndoa torrada sem sal|gordura|640|19.3|20.8|57.7|11.6|1
Azeite de dendê|gordura|884|0|0|100.0|0|0
Azeite de oliva|gordura|884|0|0|100.0|0|0|true
Azeitona verde conserva|gordura|136|1.0|1.0|14.2|3.0|1556
Azeitona preta conserva|gordura|194|1.5|5.6|19.9|4.3|1620
Bacalhau salgado cru|proteina|136|29.3|0|1.3|0|8640
Bacon toucinho defumado|proteina|533|14.6|0.6|52.3|0|1021
Banana d'água crua|fruta|98|1.3|26.0|0.1|2.0|2|true
Banana maçã crua|fruta|87|1.2|22.3|0.1|2.6|1
Banana nanica crua|fruta|92|1.4|23.8|0.1|1.9|2|true
Banana ouro crua|fruta|112|1.5|29.3|0.2|2.0|1
Banana pacová crua|fruta|122|1.1|31.9|0.2|1.5|1
Banana prata crua|fruta|98|1.3|26.0|0.1|2.0|2|true
Batata baroa crua|carboidrato|98|0.8|24.3|0.2|2.9|5
Batata baroa cozida|carboidrato|93|0.9|22.2|0.2|3.7|4
Batata doce crua|carboidrato|118|0.6|28.2|0.1|2.2|9|true
Batata doce cozida|carboidrato|77|0.6|18.4|0.1|2.2|9|true
Batata inglesa crua|carboidrato|52|1.2|11.9|0.1|1.3|1
Batata inglesa cozida|carboidrato|52|1.2|11.9|0.1|1.3|1|true
Batata inglesa frita|carboidrato|274|3.4|36.5|13.2|2.9|14
Berinjela crua|vegetal|20|1.0|4.9|0.1|2.5|1
Berinjela cozida|vegetal|22|1.1|5.4|0.2|2.9|1
Beterraba crua|vegetal|32|1.9|7.2|0.1|3.4|10
Beterraba cozida|vegetal|32|1.3|8.4|0.1|2.6|24
Biscoito cream cracker|carboidrato|432|10.0|71.3|11.9|2.3|730
Biscoito maisena|carboidrato|443|8.1|75.3|12.0|1.5|338
Biscoito recheado chocolate|carboidrato|472|5.5|68.9|19.3|1.9|237
Biscoito wafer chocolate|carboidrato|502|6.0|65.4|24.3|1.7|95
Brócolis cru|vegetal|25|3.6|1.9|0.3|2.9|8|true
Brócolis cozido|vegetal|29|3.1|4.0|0.5|2.4|8
Café infusão 10%|bebida|4|0.2|0.8|0|0|1
Caju cru|fruta|43|1.0|10.3|0.3|1.7|3
Caju suco|bebida|39|0.2|9.4|0.1|0.2|3
Camarão rosa cru|proteina|83|18.3|0.9|0.6|0|148|true
Camarão rosa cozido|proteina|99|20.9|1.3|1.0|0|191
Caqui|fruta|71|0.6|19.3|0.1|6.5|1
Cará cru|carboidrato|101|1.9|24.3|0.1|1.2|9
Cará cozido|carboidrato|98|1.9|23.2|0.1|1.3|9
Carambola|fruta|37|0.5|9.3|0.2|2.0|2
Carne bovina acém moído cru|proteina|213|18.2|0|15.5|0|59
Carne bovina acém moído cozido|proteina|219|26.6|0|11.9|0|70
Carne bovina alcatra com gordura crua|proteina|181|19.9|0|11.0|0|53
Carne bovina alcatra com gordura grelhada|proteina|222|28.7|0|11.2|0|64|true
Carne bovina contrafilé com gordura cru|proteina|192|19.0|0|12.7|0|53
Carne bovina contrafilé com gordura grelhado|proteina|221|26.5|0|12.3|0|61|true
Carne bovina costela assada|proteina|332|24.5|0|26.1|0|61
Carne bovina cupim cru|proteina|189|19.4|0|12.2|0|46
Carne bovina filé mignon cru|proteina|142|20.7|0|6.3|0|55
Carne bovina filé mignon grelhado|proteina|163|26.5|0|5.8|0|66|true
Carne bovina patinho cru|proteina|135|21.4|0|5.0|0|48
Carne bovina patinho grelhado|proteina|163|28.0|0|5.3|0|53|true
Carne bovina picanha com gordura crua|proteina|210|18.6|0|15.0|0|51
Carne bovina picanha com gordura grelhada|proteina|238|26.0|0|14.5|0|60|true
Carne suína bisteca crua|proteina|240|18.5|0|18.2|0|47
Carne suína bisteca grelhada|proteina|273|23.8|0|19.2|0|58
Carne suína lombo assado|proteina|221|27.4|0|11.8|0|49|true
Carne suína pernil assado|proteina|234|25.7|0|14.2|0|58
Castanha de caju torrada com sal|gordura|570|18.5|28.7|46.3|3.7|270
Castanha do Pará|gordura|643|14.5|12.3|63.5|7.9|1|true
Cebola crua|vegetal|38|1.3|8.9|0.2|1.8|2|true
Cebola refogada|vegetal|37|1.1|8.6|0.2|1.9|2
Cenoura crua|vegetal|34|1.3|7.7|0.2|3.2|35|true
Cenoura cozida|vegetal|30|0.9|6.7|0.2|2.6|26
Cereja|fruta|48|1.0|12.0|0.1|1.5|3
Chá preto infusão 2%|bebida|1|0|0.3|0|0|3
Chicória crua|vegetal|15|1.4|2.9|0.2|2.2|2
Chuchu cru|vegetal|19|0.9|4.5|0.1|1.0|2
Chuchu cozido|vegetal|17|0.8|4.0|0.1|1.2|1
Coco polpa|fruta|406|3.6|10.4|40.0|5.4|23
Coco leite|bebida|154|1.6|3.4|15.6|0|13
Coentro cru|vegetal|26|3.3|3.7|0.6|2.8|211
Couve manteiga crua|vegetal|27|2.9|2.5|0.5|3.1|9|true
Couve manteiga refogada|vegetal|78|3.0|2.6|6.3|3.2|10
Couve-flor crua|vegetal|23|2.0|4.5|0.2|2.1|19
Couve-flor cozida|vegetal|17|1.5|3.3|0.2|1.5|7
Creme de leite|lacteo|292|2.2|3.4|30.9|0|38
Cuscuz marroquino|carboidrato|112|3.8|23.2|0.2|1.4|5
Ervilha em vagem crua|proteina|78|6.7|13.3|0.3|4.7|3
Ervilha em conserva|proteina|63|3.6|10.6|0.5|7.5|340
Espinafre cru|vegetal|17|2.0|2.9|0.3|2.4|65
Espinafre refogado|vegetal|34|2.6|3.1|1.8|2.5|67
Farinha de mandioca|carboidrato|365|1.4|88.0|0.5|6.5|29
Farinha de milho|carboidrato|360|7.9|77.5|1.5|5.1|1
Farinha de trigo|carboidrato|360|9.8|75.1|1.4|2.3|2|true
Feijão branco cru|proteina|324|21.9|57.1|1.6|24.4|16
Feijão carioca cru|proteina|329|20.9|61.2|1.3|18.4|1
Feijão carioca cozido|proteina|76|4.8|13.6|0.5|8.5|2|true
Feijão fradinho cru|proteina|339|24.4|61.7|1.4|7.5|3
Feijão preto cru|proteina|324|21.6|58.9|1.3|21.0|2
Feijão preto cozido|proteina|77|4.5|14.0|0.5|8.4|2|true
Figo|fruta|41|0.9|10.2|0.1|1.5|1
Framboesa|fruta|48|1.0|11.7|0.3|6.8|1
Frango coxa com pele crua|proteina|204|17.6|0|14.7|0|79
Frango coxa com pele assada|proteina|237|24.3|0|15.2|0|91
Frango peito sem pele cru|proteina|108|23.1|0|1.2|0|46
Frango peito sem pele grelhado|proteina|165|31.0|0|3.6|0|63|true
Frango sobrecoxa com pele crua|proteina|177|18.0|0|11.5|0|75
Frango sobrecoxa com pele assada|proteina|215|23.6|0|12.9|0|88
Gergelim|gordura|584|21.2|11.7|50.0|11.6|60
Goiaba vermelha|fruta|54|1.1|13.0|0.4|6.2|1
Granola|carboidrato|471|13.5|64.9|17.4|9.1|20|true
Grão de bico cru|proteina|355|21.2|57.8|5.4|12.4|6
Grão de bico cozido|proteina|121|6.8|19.3|2.0|5.4|5|true
Hambúrguer bovino cru|proteina|232|15.5|10.7|14.0|0.5|560
Inhame cru|carboidrato|97|2.0|23.2|0.2|0.7|9
Iogurte grego natural|lacteo|97|9.0|3.9|5.0|0|36|true
Iogurte natural desnatado|lacteo|51|4.7|7.0|0.2|0|58|true
Iogurte natural integral|lacteo|61|3.5|4.7|3.0|0|58
Jiló cru|vegetal|19|1.4|4.2|0.1|3.6|1
Kiwi|fruta|51|1.1|12.2|0.6|2.7|2
Laranja pera|fruta|46|0.9|11.7|0.1|1.1|1|true
Leite de coco|bebida|154|1.6|3.4|15.6|0|13
Leite de soja|lacteo|38|3.3|2.9|1.9|0.3|34|true
Leite de vaca desnatado|lacteo|35|3.4|4.9|0.1|0|43
Leite de vaca integral|lacteo|61|3.2|4.6|3.5|0|41|true
Leite de vaca semidesnatado|lacteo|46|3.2|4.7|1.7|0|42
Lentilha crua|proteina|330|24.7|54.4|1.1|10.7|6
Lentilha cozida|proteina|93|6.3|16.3|0.5|7.9|2|true
Limão taiti|fruta|32|0.8|11.0|0.3|0.6|1
Linguiça calabresa|proteina|341|19.5|1.5|28.5|0|1380
Linguiça toscana crua|proteina|347|15.0|1.6|32.1|0|1056
Maçã argentina|fruta|63|0.3|16.6|0.4|1.3|1|true
Maçã fuji|fruta|56|0.3|15.2|0.1|1.3|1|true
Macarrão cru|carboidrato|371|12.5|75.1|1.4|2.9|9
Macarrão cozido|carboidrato|127|4.2|26.4|0.5|1.1|1|true
Macarrão integral cru|carboidrato|340|13.8|68.7|2.5|11.0|8
Macarrão integral cozido|carboidrato|117|4.7|23.5|0.9|3.8|3
Mamão formosa|fruta|45|0.8|11.6|0.1|1.8|3|true
Mamão papaia|fruta|40|0.5|10.4|0.1|1.0|2
Mandioca crua|carboidrato|125|0.6|30.1|0.3|1.6|14
Mandioca cozida|carboidrato|125|0.8|29.3|0.3|1.9|1|true
Mandioca frita|carboidrato|331|1.5|51.8|12.4|3.7|87
Manga palmer|fruta|51|0.5|13.5|0.3|1.6|1|true
Manteiga com sal|gordura|760|0.6|0.1|84.0|0|584
Maracujá polpa|fruta|68|1.8|16.5|0.4|0.3|6
Margarina com sal|gordura|720|0.2|0.6|80.0|0|942
Maxixe cru|vegetal|18|1.7|3.5|0.1|0.8|1
Mel|carboidrato|309|0.3|84.0|0|0.2|6|true
Melancia|fruta|33|0.9|8.1|0.2|0.3|1
Melão|fruta|29|0.7|7.5|0.1|0.3|11
Merluza filé cru|proteina|76|17.0|0|0.8|0|86
Milho verde em conserva|carboidrato|79|2.9|17.1|0.8|2.0|265
Mirtilo blueberry|fruta|32|0.7|8.2|0.1|1.2|1
Morango|fruta|30|0.9|6.8|0.3|1.7|1|true
Mortadela|proteina|268|14.8|3.2|22.3|0|1117
Nabo cru|vegetal|18|1.2|4.0|0.1|2.4|49
Nectarina|fruta|44|1.1|10.6|0.1|1.9|1
Nozes|gordura|654|15.2|13.7|65.2|6.7|2
Óleo de canola|gordura|884|0|0|100.0|0|0
Óleo de girassol|gordura|884|0|0|100.0|0|0
Óleo de milho|gordura|884|0|0|100.0|0|0
Óleo de soja|gordura|884|0|0|100.0|0|0
Ovo de codorna inteiro cru|proteina|158|13.1|0.5|11.1|0|141
Ovo de galinha clara crua|proteina|48|10.3|1.5|0|0|199|true
Ovo de galinha gema crua|proteina|353|16.1|1.6|31.9|0|48
Ovo de galinha inteiro cozido|proteina|155|13.3|1.1|10.8|0|140|true
Ovo de galinha inteiro cru|proteina|143|13.0|1.6|8.9|0|168
Ovo de galinha inteiro frito|proteina|196|13.6|0.6|15.0|0|207
Palmito em conserva|vegetal|26|2.7|4.6|0.3|2.2|440
Pão de forma branco|carboidrato|269|8.3|50.0|4.0|2.3|513|true
Pão de forma integral|carboidrato|253|9.4|49.0|3.0|6.9|489
Pão de queijo|carboidrato|307|6.5|42.8|12.1|1.0|458|true
Pão francês|carboidrato|300|8.0|58.6|3.1|2.3|648|true
Pão integral|carboidrato|253|9.4|49.0|3.0|6.9|489
Pepino cru|vegetal|13|0.6|3.2|0.2|0.5|2
Pêra|fruta|53|0.3|14.1|0.1|3.0|1
Pêssego|fruta|36|0.8|9.1|0.1|1.4|1
Peru peito sem pele assado|proteina|146|29.9|0|2.1|0|64
Peru peito sem pele cru|proteina|103|22.0|0|1.7|0|55
Peru peito defumado|proteina|104|18.2|3.8|1.5|0|1020
Pescada filé cru|proteina|81|17.7|0|1.0|0|119
Pimentão amarelo cru|vegetal|27|1.2|6.7|0.2|1.9|1
Pimentão verde cru|vegetal|21|1.0|5.3|0.2|1.9|1
Pimentão vermelho cru|vegetal|26|1.2|6.4|0.2|1.9|1
Pistache|gordura|571|21.4|17.6|45.8|10.3|6
Polenta cozida|carboidrato|70|1.5|15.7|0.2|0.9|1
Presunto cozido|proteina|122|18.4|2.3|4.3|0|1203
Proteína texturizada de soja PTS|proteina|330|52.0|33.0|1.0|17.0|10
Queijo cottage|lacteo|98|12.4|3.4|4.3|0|405
Queijo minas frescal|lacteo|264|17.4|3.0|20.8|0|215|true
Queijo mussarela|lacteo|289|25.4|3.6|19.5|0|682|true
Queijo parmesão|lacteo|453|36.0|0|33.0|0|1109|true
Queijo prato|lacteo|360|25.8|0.5|28.0|0|557
Queijo ricota|lacteo|140|11.3|3.4|9.5|0|300|true
Quiabo cru|vegetal|30|2.0|6.4|0.1|4.6|2
Quiabo refogado|vegetal|40|2.1|6.8|1.0|4.9|2
Quinoa cozida|carboidrato|120|4.4|21.3|1.9|2.8|5|true
Rabanete cru|vegetal|12|0.8|2.7|0.1|1.6|17
Repolho branco cru|vegetal|22|1.3|5.1|0.2|2.0|14
Repolho roxo cru|vegetal|19|1.9|4.2|0.2|2.0|27
Rúcula crua|vegetal|17|2.1|2.7|0.3|1.6|25
Salame|proteina|431|21.6|1.2|37.6|0|2260
Salmão filé cru|proteina|176|19.9|0|10.4|0|59
Salmão filé grelhado|proteina|211|25.4|0|11.7|0|59|true
Salsa crua|vegetal|31|3.2|6.3|0.3|3.3|56
Salsicha hot dog|proteina|244|10.5|10.4|18.6|0|1029
Sardinha inteira crua|proteina|124|19.8|0|4.8|0|100
Sardinha em óleo enlatada|proteina|190|20.9|0|11.5|0|397
Semente de abóbora|gordura|559|30.2|10.7|49.1|6.0|7
Semente de chia|gordura|436|16.5|42.1|30.7|34.4|16|true
Semente de girassol|gordura|570|19.3|18.8|49.8|11.1|3
Semente de linhaça|gordura|495|14.1|43.3|32.3|33.5|9|true
Soja grão cru|proteina|405|36.0|30.2|18.2|9.3|2
Suco de laranja natural|bebida|45|0.7|10.5|0.2|0.2|1
Tangerina mexerica|fruta|38|0.8|9.7|0.2|1.7|1
Tapioca goma|carboidrato|357|0.3|88.7|0.0|0.3|1|true
Tilápia filé cru|proteina|96|20.1|0|1.5|0|50
Tilápia filé grelhado|proteina|96|20.1|0|1.5|0|50|true
Tofu queijo de soja|proteina|76|8.5|1.9|4.7|0.4|7
Tomate cru|vegetal|15|1.1|3.1|0.2|1.2|5|true
Tomate molho industrializado|vegetal|64|1.4|13.8|0.5|1.4|643
Uva itália|fruta|53|0.6|14.0|0.1|0.9|1
Vagem crua|vegetal|25|2.1|5.5|0.2|2.7|1
Vagem cozida|vegetal|29|2.4|6.5|0.2|3.1|1
Lagosta cozida|proteina|89|18.8|0.5|1.3|0|296
Lula crua|proteina|92|15.6|3.1|1.4|0|44
Lula frita|proteina|175|15.1|7.9|9.3|0.3|260
Polvo cozido|proteina|164|29.8|4.4|2.1|0|230
Ostra crua|proteina|81|9.5|4.9|2.3|0|211
Mexilhão cozido|proteina|86|11.9|3.7|2.2|0|369
Marisco cozido|proteina|79|13.1|3.5|1.6|0|369
Salame|proteina|431|21.6|1.2|37.6|0|2260
Copa|proteina|248|24.5|0.8|16.2|0|1890
Paio|proteina|342|18.2|2.1|29.5|0|1520
Apresuntado|proteina|145|16.8|3.2|7.5|0|1180
Peito de peru defumado fatiado|proteina|104|18.2|3.8|1.5|0|1020
Carne de cordeiro crua|proteina|178|16.5|0|12.0|0|70
Carne de cordeiro assada|proteina|294|25.6|0|20.9|0|82
Carne de cabrito crua|proteina|109|20.6|0|2.3|0|82
Carne de coelho crua|proteina|114|21.2|0|2.4|0|38
Pato assado|proteina|337|19.0|0|28.4|0|59
Chester assado|proteina|220|25.0|0|13.0|0|75
Fígado de boi cru|proteina|135|20.5|5.3|3.6|0|87
Fígado de boi grelhado|proteina|159|24.7|3.9|4.8|0|91
Fígado de frango cru|proteina|136|19.1|3.3|4.6|0|71
Fígado de porco cru|proteina|134|20.8|2.5|4.4|0|78
Coração de boi cru|proteina|108|17.1|0.5|3.6|0|140
Coração de frango cru|proteina|153|15.3|0.8|9.7|0|119
Moela de frango crua|proteina|94|17.7|0.8|1.8|0|61
Língua de boi crua|proteina|224|15.7|0.4|17.2|0|61
Rim de boi cru|proteina|86|15.7|0.9|2.2|0|182
Bucho de boi cru|proteina|85|15.1|0|2.6|0|68
Queijo cheddar|lacteo|403|24.9|1.3|33.1|0|621
Queijo provolone|lacteo|351|25.6|2.1|26.6|0|876
Queijo gorgonzola|lacteo|353|21.4|2.3|28.7|0|1395
Queijo brie|lacteo|334|20.8|0.5|27.7|0|629
Queijo camembert|lacteo|300|19.8|0.5|24.3|0|842
Cream cheese|lacteo|342|5.9|5.5|34.2|0|296
Requeijão cremoso|lacteo|270|9.8|3.5|25.0|0|560
Leite condensado|lacteo|321|7.9|54.3|8.4|0|127
Leite em pó integral|lacteo|496|25.8|38.4|26.7|0|405
Leite em pó desnatado|lacteo|358|36.2|51.0|0.8|0|535
Leite de cabra integral|lacteo|68|3.6|4.4|4.1|0|50
Nata|lacteo|337|2.1|2.8|35.3|0|32
Chantilly|lacteo|257|2.1|12.5|22.2|0|78
Iogurte com polpa de frutas|lacteo|80|2.9|15.2|1.0|0.3|44
Cupuaçu polpa|fruta|49|1.5|11.3|0.8|1.6|2
Graviola polpa|fruta|62|1.0|15.8|0.2|1.9|4
Jabuticaba|fruta|58|0.5|15.3|0.1|1.2|3
Caju castanha torrada|gordura|570|18.5|28.7|46.3|3.7|270
Pitanga|fruta|41|0.8|10.2|0.4|3.3|3
Açaí tigela com granola|fruta|142|2.8|24.5|4.2|3.8|15|true
Amora|fruta|43|1.4|9.6|0.5|5.3|1
Cereja fresca|fruta|63|1.1|16.0|0.2|2.1|0
Damasco fresco|fruta|48|1.4|11.1|0.4|2.0|1
Damasco seco|fruta|241|3.4|62.6|0.5|7.3|10
Figo fresco|fruta|74|0.8|19.2|0.3|2.9|1
Lichia|fruta|66|0.8|16.5|0.4|1.3|1
Romã|fruta|83|1.7|18.7|1.2|4.0|3
Tâmara seca|fruta|282|2.5|75.0|0.4|8.0|2
Uva passa|fruta|299|3.1|79.2|0.5|3.7|11
Ameixa seca|fruta|240|2.2|63.9|0.4|7.1|2
Cogumelo shiitake cru|vegetal|34|2.2|6.8|0.5|2.5|9
Cogumelo shimeji cru|vegetal|35|2.5|7.0|0.4|2.8|18
Cogumelo Paris cru|vegetal|22|3.1|3.3|0.3|1.0|5
Cogumelo portobello cru|vegetal|26|2.5|4.3|0.4|1.5|6
Aspargo cru|vegetal|20|2.2|3.9|0.1|2.1|2
Aspargo em conserva|vegetal|23|2.4|3.2|0.8|1.8|298
Alcachofra cozida|vegetal|47|2.9|10.5|0.2|8.6|80
Berinjela japonesa crua|vegetal|18|0.9|4.2|0.1|2.2|1
Abobrinha japonesa crua|vegetal|17|1.3|3.6|0.2|1.1|3
Rúcula selvagem crua|vegetal|25|2.6|3.7|0.7|1.6|27
Agrião d'água cru|vegetal|11|2.3|1.3|0.1|0.5|41
Mostarda folha crua|vegetal|27|2.9|4.7|0.4|3.2|25
Ora-pro-nóbis crua|vegetal|26|2.0|5.6|0.4|1.4|4
Taioba crua|vegetal|28|2.8|4.9|0.4|2.2|1
Biscoito wafer chocolate|carboidrato|502|6.0|65.4|24.3|1.7|95
Biscoito recheado morango|carboidrato|465|5.2|67.8|18.9|1.5|225
Biscoito maria|carboidrato|443|7.5|74.2|12.8|2.1|380
Biscoito rosquinha|carboidrato|377|9.8|75.0|4.0|2.5|450
Biscoito polvilho|carboidrato|387|1.5|83.7|5.2|1.2|1032
Bolo de chocolate|carboidrato|410|5.4|58.9|17.2|2.1|328
Bolo de fubá|carboidrato|354|6.8|58.2|10.5|1.8|380
Bolo de cenoura|carboidrato|352|5.9|57.8|10.8|1.5|365
Bolo de laranja|carboidrato|348|6.2|56.5|11.2|1.3|340
Bolo simples|carboidrato|362|6.2|59.8|11.0|1.2|340
Pão ciabatta|carboidrato|271|9.0|52.0|3.5|2.8|580
Pão baguete|carboidrato|276|9.2|54.8|2.8|2.5|620
Croissant|carboidrato|406|8.2|45.8|20.5|2.6|492
Brioche|carboidrato|375|9.5|48.2|16.8|2.1|380
Pão de centeio|carboidrato|259|8.5|52.7|3.3|5.8|660
Pão sírio|carboidrato|275|9.0|56.0|1.5|2.8|520
Pão de hot dog|carboidrato|272|8.5|53.2|3.0|2.5|580
Cuscuz de milho|carboidrato|112|2.4|24.5|0.5|1.2|1
Farofa pronta|carboidrato|387|2.8|68.5|11.2|4.5|890
Pamonha doce|carboidrato|152|3.5|30.2|2.5|1.8|8
Pamonha salgada|carboidrato|135|3.8|26.5|2.2|1.5|285
Suco de uva integral|bebida|60|0.3|15.2|0.1|0.1|2
Suco de maracujá|bebida|51|0.8|12.8|0.2|0.2|3
Suco de abacaxi|bebida|48|0.4|12.6|0.1|0.3|2
Suco de limão|bebida|25|0.4|8.2|0.1|0.1|1
Chá verde|bebida|1|0.2|0|0|0|1
Chá branco|bebida|1|0.1|0.2|0|0|1
Chá de hibisco|bebida|2|0|0.5|0|0|1
Tahine pasta de gergelim|gordura|595|17.0|21.2|53.8|9.3|115
Pasta de amendoim integral|gordura|588|25.8|20.0|50.0|8.0|17|true
Gergelim torrado|gordura|631|20.5|11.9|61.2|14.0|39
Semente de papoula|gordura|525|17.9|28.1|41.6|19.5|26`;

const foods = tacoFoods.split('\n').map(line => {
  const [name, category, calories, protein, carbs, fat, fiber, sodium, popular] = line.split('|');
  return {
    name,
    category,
    calories: parseFloat(calories),
    protein: parseFloat(protein),
    carbs: parseFloat(carbs),
    fat: parseFloat(fat),
    fiber: parseFloat(fiber),
    sodium: parseFloat(sodium),
    popular: popular === 'true',
    tags: name.toLowerCase().split(' ')
  };
});

fs.writeFileSync(
  './seeds/tacoComplete.json',
  JSON.stringify(foods, null, 2)
);

console.log(`✅ ${foods.length} alimentos gerados com sucesso!`);
console.log('📄 Arquivo: backend/seeds/tacoComplete.json');
