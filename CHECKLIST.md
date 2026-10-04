# Checklist antes de publicar

## 1) Fotos
- [ ] As fotos atuais (`foto-sala.jpg`, `foto-detalhes.jpg`, `foto-poltronas.jpg`) são imagens enviadas por você,
      ampliadas 2x a partir de arquivos pequenos (cerca de 400 px). Parecem renderizações de projeto de
      interiores: confirme a licença/autorização de uso e, de preferência, troque por fotos do seu consultório
      (mesmos nomes de arquivo, JPG, ~1000x1250 as verticais e ~1400x980 a horizontal).
- [ ] `foto-detalhes.jpg` traz o crédito de uma arquiteta na parte inferior. Se não houver autorização, troque a foto.
- [ ] Se um arquivo `foto-*.jpg` faltar, a página mostra a ilustração `consultorio-*.svg` correspondente.

## 1b) Ilustrações (reserva)
- [ ] As imagens em `imagens/consultorio-*.svg` são ilustrações. Quando tiver fotos reais do
      consultório, salve-as (WebP/JPG) e troque o `src` em `index.html`, mantendo os `alt`.
- [ ] Opcional: troque `og-consultorio.png` por uma foto 1200x630 (usada ao compartilhar o link).

## 2) Formulário de contato
- [ ] `envia.php` NÃO veio no zip. Mantenha o arquivo atual do servidor e ajuste nele o
      e-mail de destino (jnmmelo@gmail.com) e o assunto/remetente, que ainda podem citar a odontologia.
- [ ] `csrf.php` segue igual (só mudou o comentário do cabeçalho).

## 3) Dados que ainda faltam (não inventados)
- [ ] Endereço/cidade e mapa, se houver atendimento presencial.
- [ ] Instagram/LinkedIn, se quiser incluir.
- [ ] Horários de atendimento (hoje: "combinados no primeiro contato").

## 4) SEO / infraestrutura
- [ ] Definir o domínio e descomentar `canonical`, `og:url` e `og:image` no `<head>`.
- [ ] Descomentar e ajustar a regra de WWW canônico no `_htaccess`.
- [ ] Subir `robots.txt` e `sitemap.xml` e cadastrar no Google Search Console.
- [ ] Revisar as respostas do FAQ (visível em `#duvidas` e no JSON-LD) — devem ser idênticas.
- [ ] Confirmar no cPanel se `mod_expires`, `mod_deflate` e `mod_headers` estão ativos.

## 5) Publicidade em psicologia
- [ ] Revisar o texto com as normas do CFP/CRP-17 para publicidade (sem promessa de resultado,
      sem preços promocionais, sem depoimentos de pacientes).
