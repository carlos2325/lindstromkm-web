# Manual de identidad — Energy & Engineering Group

Manual único para las dos marcas del grupo: **ITEL2 ENERGY** (trading energético) y
**LINDSTROM KM Ltd** (ingeniería / offshore). Comparten sistema de layout, tipografía y
componentes (`assets/styles.css`, `assets/app.js`); se diferencian por **paleta e isotipo**.

> Fuente de verdad de color: los tokens CSS de `assets/styles.css`. Cualquier SVG nuevo debe
> usar exactamente estos hex. No introducir cobres/turquesas alternativos.

---

## 1. Arquitectura de archivos

```
assets/
  logos/
    itel2-logo.svg        · app icon ITEL2 (cuadrado redondeado) — uso en topbar y hero
    lkm-logo.svg          · app icon LINDSTROM (cuadrado redondeado) — uso en topbar y hero
  brand/
    BRAND.md              · este manual
    itel2/
      symbol.svg          · isotipo (monograma I2) aislado
      favicon.svg         · 64×64 simplificado (pestaña / PWA)
      logo-dark.svg       · lockup horizontal, fondo oscuro
      logo-light.svg      · lockup horizontal, fondo claro
    lindstrom/
      symbol.svg          · isotipo (escudo-19) aislado
      favicon.svg         · 64×64 simplificado (pestaña / PWA)
      logo-dark.svg       · lockup horizontal, fondo oscuro
      logo-light.svg      · lockup horizontal, fondo claro
```

**Regla:** cada marca tiene UN solo isotipo y UN solo cobre/turquesa. El isotipo del `logos/*.svg`
(app icon), el del `brand/*/symbol.svg`, el del favicon y el de los lockups deben ser el mismo
dibujo y la misma paleta. (Antes había dos cobres y dos escudos distintos en Lindstrom: unificado.)

---

## 2. Paletas

### ITEL2 ENERGY — cian (logo pájaro origami) sobre tinta
> Logo oficial: **pájaro origami turquesa** (fichero raster `assets/brand/itel2/itel2-bird.png`,
> fondo recortado a transparente e incrustado en los SVG de marca). El color cian del logo manda.

| Rol | Token CSS | Hex |
|---|---|---|
| Fondo tinta | `--bg` | `#0A1016` |
| Panel | `--panel-solid` | `#0F1822` |
| **Cian (acento primario, del logo)** | `--accent` | `#00A8B8` |
| Cian claro (hover) | `--accent-strong` | `#33C6D2` |
| Oro (líneas / detalle) | `--gold` | `#D8C28B` |
| Texto | `--text` | `#EDF3F8` |
| Texto atenuado | `--muted` | `#9FB0BF` |
| Blanco de logo | — | `#F2F6F9` |

### LINDSTROM KM — cobre / acero / navy (kit oficial "Design 19")
| Rol | Token CSS | Hex |
|---|---|---|
| Navy profundo (fondo / dark) | `--brand-abyss` | `#0B1320` |
| Navy superficie (tarjetas, nav) | `--panel-solid` | `#0F1F33` |
| Borde técnico | — | `#1E3A5F` |
| **Cobre metálico (acento primario / CTAs)** | `--brand-copper` / `--accent` | `#C87A3E` |
| Cobre claro (hover) | `--brand-copper-light` / `--accent-strong` | `#E0A96D` |
| Oro-arena (estratos) | `--brand-gold-sand` / `--gold` | `#D4A373` |
| Acero (secundario / textos) | `--brand-steel` | `#64748B` |
| Acero claro (texto principal en dark) | — | `#CBD5E1` |
| Blanco de marca (titulares) | `--brand-white` | `#F8FAFC` |

> ⚠️ El cobre canónico es **`#C87A3E`** (cobre metálico del kit oficial Design 19). No usar
> `#C2784E` (aproximación antigua, ya retirada).
>
> **Isotipo 19**: escudo submarino con broca de perforación y estratos geológicos. Geometría
> canónica del escudo: `M50 95 L15 72 V12 L50 20 L85 12 V72 Z`. Tagline oficial del lockup:
> **OCEANIC ENERGY · SUBSEA DRILLING · EPC**. `theme-color` del navegador: `#0B1320`.

---

## 3. Tipografía

| Uso | Familia | Peso |
|---|---|---|
| Titulares / logotipo | **Barlow Condensed** (fallback DIN Alternate, Oswald, Arial) | 600–700 |
| Texto y UI | **Inter** (fallback Avenir Next, Segoe UI) | 400–700 |
| Datos / etiquetas técnicas | **JetBrains Mono** | 500–700 |

Se cargan por `@import` de Google Fonts en `assets/styles.css`. Nombre de marca siempre en
mayúsculas con `letter-spacing` positivo.

---

## 4. Uso del logotipo

- **Isotipo solo** (`symbol.svg`): avatar, favicon grande, marcador, usos ≤ 64 px de ancho útil.
- **Lockup horizontal** (`logo-dark/light.svg`): cabeceras, documentos, firmas.
  - `-dark` sobre fondos oscuros/foto; `-light` sobre fondos claros (papelería, PDF).
- **App icon** (`logos/*.svg`): contenedor cuadrado redondeado; topbar y tarjetas de la web.
- Área de respeto mínima: la altura del isotipo por cada lado.
- Tamaño mínimo legible: isotipo 24 px; lockup 120 px de ancho.

**No hacer:** recolorear el isotipo fuera de la paleta · deformar/rotar · añadir sombras ·
mezclar el cobre de una marca con la otra · usar el lockup sobre un fondo sin contraste.

---

## 5. Componentes compartidos

Definidos en `assets/styles.css`: `topbar`, `company-hero`, `card`, `option-card`,
`contact-form`, `hero-media`, `footer`, `lang-switcher`, `company-hero__metric`,
`brand-manual-note`, `asset-preview`. El tema por marca se activa con `body[data-page="itel2"]`
o `body[data-page="lindstrom"]`; el acento (`--accent`) propaga a botones, hovers, focus y labels.

Multiidioma: ES/EN/FR/AR con RTL, vía `data-i18n` + diccionario en cada página y lógica en
`app.js` (una clave sin traducir conserva el texto por defecto del HTML).

---

## 6. Pendientes de producción (fuera de este pack)

1. **Vectorizar el texto** de los lockups a paths (hoy usan `font-family` en vivo: si el equipo
   no tiene Barlow Condensed, cae a Arial). Necesario antes de entregar el logo a terceros.
2. Exportar PNG/ICO del favicon para navegadores sin soporte SVG.
3. Fotografía propia de hero (las actuales son genéricas de stock).
4. Datos legales reales (razón social, CIF, dirección, CEO) — hoy placeholders "pendiente".
5. Cuando existan repos separados, versionar este pack en `shared-design-system`.
