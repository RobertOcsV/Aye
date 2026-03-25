# Pasta de Modelos 3D — Ayê

Coloque aqui seus arquivos `.glb` ou `.gltf` para usar no carousel 3D do hero.

## Nomes esperados (padrão atual)

| Arquivo          | Slot no hero            |
|------------------|-------------------------|
| `modelo-1.glb`   | Slide 1 — Imagens de Orixás        |
| `modelo-2.glb`   | Slide 2 — Ferramentas Ritualísticas |
| `modelo-3.glb`   | Slide 3 — Altares Portáteis        |

## Como adicionar mais modelos

1. Coloque o arquivo `.glb` aqui
2. Abra `index.html` e duplique um bloco `<div class="model-slide">` dentro de `.model-track`
3. Troque o `src=""` pelo nome do novo arquivo e o `poster=""` pela imagem de pré-visualização
4. O carousel cria os dots automaticamente — não precisa alterar o JS

## Como exportar modelos em .glb

- **Blender**: File → Export → glTF 2.0 → selecione "glTF Binary (.glb)"
- **Tinkercad**: exportar como OBJ e converter em https://www.convert3d.org
- **Sketchfab**: baixar modelos licenciados no formato glTF

## Enquanto não tiver o arquivo .glb

O atributo `poster="..."` em cada `<model-viewer>` define a imagem estática exibida
enquanto o modelo 3D não está disponível. A landing page funciona normalmente.
