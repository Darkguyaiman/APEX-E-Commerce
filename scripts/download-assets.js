const fs = require('fs');
const path = require('path');
const http = require('https');

const IMAGES = {
  'hero-home.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuApIH8I-S73LCoTJ2FSATEw5V7cBrbZtC3IPlfQePnTW1EtcN-kyJVgz0O9QntyZX-lrSmTjENgx-mw7ERnuMXJpduIzI6dodD2YIO9dcS4jw6cWHdYpqMPqAOMCuJe9B4JKZ1l49_7NhKpOgb2_GQEaLc0D9dQuBL6vtQD0H8qZTtr4_1UooiuUxsV43_WLL2DRoLpPDeghBln8Z86FGc31xro2QzMtshjpk6Wh4riF9_p_PoPOOYswg',
  'collection-mens.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX2yUme1WzrzNCIiYDGXEO7suM0t47fzkqOqP8j-QwLULQLopebnwKq5NfZ5K4_B39l8P9M4AmsXYwXx42MUgJAC7Rqa5HZWPW4Tv2wZze9nET4tg8-ozL3ZCftVBZGGhOFKqYNIVEd4ROV2fZtCDlhG1PemTMK4jlM8HD4et2m_gByCpgPfHOvWgtz77bc3-O9xD_bbxeoDWjUtu_BTqCBLmTDVFB5iUtorFxVEWhJyf2-cAAdiFTGw',
  'collection-womens.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEuSggDKaAs2rC5mJL3MdZ3cSNlPXlZm-45hqwJKsXT_7X3hSBOm2SwjRt0A0W43yJrGa2fFwA59w3-eecXYhZ0dcol9_kissD5CIyDINqhSWwZOJvQH0OOoMfyCWBJ6R93i9exlMXerAI5dqWy7ik6Jl5tBK0k0ML-uKrxrjSHwFt3F3hZRxwpO5nmmcNawPOdKZQYo0GFZusLU2r12hPUtlWmak9e7VFN9hArHdllVGCDNbefvfyjQ',
  'collection-speedlab.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGN2gjcNfM1jefe9ELwurTcm_SGWtT22AuJp5eRPwZyFfDHfUtb6yjfivAQw5n8F-RNxFpmq58wyzQ_cqFTOdfGmoZvI2rFsltlQV1ni-UtR4GfLHe9K4ToCirVFKKW8KQ-uyJSEI00QwM5R9k5ltYoCDkJfbAQmQQakI7LUQNZ3v1_LXYysKsBF2z3A-JQ_VNkBtWG0L8GJC5t0RLZRgfByWVBsFM1S151Jircxkh3hPXrNkqRhc89Q',
  'product-predator.png': 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_THNlLoAPwE28-mW5yvyOfEJANVlKU0EOKIioK8sdf3nDJClAVezPa7oBnqqwGRc3xZM2I7TO9_5JwMFakP2S26zZLOAIrGTBZ4JH87wDGSfedNbe-ThreF1oI44ZYxZGC8GeomDkOaSfZqSJ9HiZb_aypG74u5m9w8DLBXnVxSERZV38U6hFqJ2-XqR1JtbAyw8RjdSZxLgWFLnoYQUJu4Xhu8L-iscuCfpzSH8RNwNW1WL7cpUqFQ',
  'product-stealth.png': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCt1yKmb5IERc379jcO3OFyqqvlRqS64otut5mt8mRU_8OZZvVSDQbMl05Uz6s0Uvtk10BQc0zCFKE6x1fXmt6xc_RjMSunIhVCwkTT1zfq7ZbKXLrrqGoLMFi-Xmy53Rpcpts9jwIjl_dvMrZ2KYHQwOGkVO2xz-r-JTPehjnK1VCHXSD9N3mtU__bfiHROA0iW4SknCnO0UQhaXahqluDC3xODWdo69LBu6rYBJflPJVxjaLggkJgJA',
  'product-titan.png': 'https://lh3.googleusercontent.com/aida-public/AB6AXuD37ca3MxwNAdjWpxaK5ifxcRYtJr8Oo4M7vQOwBFJ5HskZC9lLKPxcvmoUrXNU2GLtKwuxV037xVcqiOPoSY3RP9RSSL8OFoiN7HBm43yKelPeLPo10XB2etEqI-wzsIgSPK_E0FWb2nhbPAJuwBK_YuJ5KEuHtVdXQ0fyxUMn6QnElLxYatKOfDIGdK2xAqHV5MiPnP1ei5N884w9dXYInK2-Ds0lP91f8KJLouFMbLVrwR3peKWuLA',
  'product-ghost.png': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjGwB_5IeMX2SLa7SgRcTYI6lwor_cfcDwQaBL1oCQpm0079zrilzrfHXTiwrhAs6Nwf_iyUHyx1O6Us0eScdgf4t6j5N3pdzYZDKtZtYyuZhnehYZQnGtTInuQAJb_QoSyyhlOWKoqzBWrLyPTuAcvv0-u_HD68r0J0eyy6HSTDMs0z8od-PS9k85_Xyc6vbK3q-Jv2s0vxxnfqiZWXBCcmaz4ThkKllW5l8HsuZjNUHNWQub3_op7A',
  'tech-carbon-sole.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnyMRmoaHTP075Y8r38WPigeQ34rRDO_w_Dsf8ZcXCGqZ8DJYcwtJJzGHkTl-rswYoljmldachHQbdFh7DJPq6EP9RTwx8FAWY5IMNdcxOGAz4co0ND-c0u6uLRC4649DiT-Nu_sNlOqJxKgeMeL107JhvI5gf2Baegx9KTmF71BpegZ04rL_iCcCt4zdwV3SM4IhWF2wdIAxDPYgh8yHoEaHSOqJerYn_yuSFl1GkB0I8gO2TAK8l5A',
  'product-crimson-vapor.png': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIJaEiTs6bOZmcJKK49fi7ng1BX1tuyaBvtvwKKo_iPazU-zni-rf2itM9Fxdinu6rKIvBTuC_M9yHLI4bTzZXSectcLrLw_VTh5Qbm7-3dk3OHDqj4iNbGAMnIdc17X0z4GW9AAZl3OJufAnLBzXTLHiYdm9CbiTin7_ufCImSLz9Jqq-oUCbUw-AU2SMoswlxZa0-C7-kBdX3zYqN_a2zKUm0ki0IuUGEf3pDcLrLq6ZHxYIiEkUPQ',
  'product-ghost-phantom.png': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp5iYpA28i28zZuapQRMTIof9qtm3oE_w-v8A9l2TxjwDdckDP9AkD_I7v_Mh8VAcaMGij_m_a8dMisdARafF5UP6_O2M6kS_CAhZaRQJEUI5cBX1JWDupizoacPNTWaWOJfceDT8oe6kTRUqp9eHVSxhhRe9LMF0KY0efwtTnRg7althWYjGFOCH3qHVVbx3YiSK6Iyt2s96E0UIE7adQENtSPIXeRyKdWE4ItCE_3MVLWXwdkeG1aQ',
  'product-velocity-react.png': 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3wqPz-AGKIrozvmkmAtx0_5i2Yv8y3i-W8GpwpNneOBY9bZODkVDwbKbZ0Ws-CR7ahlnG05SY8Na__IF6dYAd-jdzPHb9a7H4w82XJjo2jgnK3JPd7D-sU-IuNb0LWngZOrz9fDPgOI-ctaek2w8jGW7Lr_ul79LSdAVxrYf9qBz0scwNZsrrFeUBzPWYe68ueVm9OQvoMWcwl3wq7MyCWY4sHwI8x1qcFAd-a8utQbDkZGsyFXewcw',
  'product-merc-alpha.png': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFHn4IJQEOcV6WKD-pFoGdp85oXfHLyIQ4LdW9gM0rkRaEq985byI05clxcw7GNXan_YBlauFcU0JQfa_58ftrZ5lMJs4_R4RNpHO5stn7SaqUSbYnBwKOp6ReBYBkbWE3m4HLMzyh_oKyHCg5I6LdOWpvjj92aR7DumBnW0El7NqypV8_ZRWBkzldFyMO0oqbr8X44t9qfR3RSSgkjH56eDdlZmmSgcwGCyCuOvQTJGqDvM3MzD00zQ',
  'tech-anatomical-fit.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOuniHw2gh244nmPuZmPbfWBwS4Sgqb44mQnc0ttLGw9ncROr3GhBumcZKaXokGcuG5ER3TQLfuAUK-nWO9CE_YtpVU6EqcVz38uV_k-gqcwwJGyo7yZ14uhzkrPiB_z_SkwpSDrOoi5PSYJikaz1_RObBodT86wNacN7niDE2hDtbZb0NXDbQQRR-ylTSftqHeRBYGL_l3DxOILGOIQd7J1QE41PUN93acaEcoUoD8H68C-y-lPqYHg',
  'hero-gold-elite.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfhtaQD7k5ANCd8Nndwe9CDbDioxoWrvVl6m3Ewe6K7UyR5p0eRjYLdOUvDjuuAhYKgGz3kiI7PWfreX2Y3aqKqUcw8sL3D-ZNJ9YfASGNWcuS_T8aUyII4XIA5MWnF0vwppjCZNK4dk5UzNJA6tBmkwogbrq9Z5EUlcN9vJQajkiFnmoLJ3RJH1g6bDwmb61Zv3YhoApUhQboRN71Fd5hStuwEjP7DK78F_0ielNlPcAm1CmfHLeM2w',
  'kit-socks.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLuztp9ilfJYA3cgUO0JbGyT88PMYos2mg1xBYrXCuqlfsrCejEpabv_41Bw5JqHLzsCVk6lL_JrLyORKV9earBH4mNnFPbYjqArCZctU-PElLtjfoy9CA_2J5V53pMIqByzlSGiiwbPUQYQjVAEpumGD0hT2rSiQqEAmFg-LTA-veX2hWlZAaxYqfeTUMaaId3v-OlLtZ0Nx5ci6lZieAz5EgyBQmnOXQ92sw9H6xtUguqFHU4pFMUw',
  'kit-shields.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ-6tGE6kBWTMkMENkq5IlxYoz7apK8PwO67pCyG-sQ1fymswpD9j6tJW2uLEKm1mLHMqYIlz-QoG4FpfWwv8ISqJKiOtd5dGZ-RgSovzRoNDVlUQbKnmIn6yHAn3HipJ8tpfmLOsawhUp6bUasbQRv4evy_Ln6s7HoTafkfXQ_KA0zfNe0G4CVI7s1hV80eHPs6wNEAs9aMa-U90qmlF6Bnqkq9qFTIS8VEvxbnDoTWQL-k6lfvKkgA',
  'kit-duffel.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYm8JCKim0jE3bZBl1DzIUD7A1GJgMT5FUpwcSd6OD9gUgah9_yUdYmiOsa7UdfwcmBWsFCCRsU477N9AAZEJDUT057-79ATIeguxZMuezeXMn-I3A-J1_OImfcKARSxRrwrpsbCHVK9v82LFDlMCf_kFDvn1ySuyK9tQFgVnCc4ia5VHl28uxhRfayjOpUHwuqTR8FcvhnTjcLodYnDQWDe_1aK_XkYP8Lg-ZbZPVB9xVklgPvW3smw',
  'kit-top.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFlD5Uc_1uWNueV7AM5eNIaBG1YrUF5eK7X5h-In3yDqvNYfe_AWw5v35Ji2UNnydGueQRJkI7iWc2sVQGXUfp34yluXsrN8N1h4rtaggF5nnsew60R7F_UdzxX8ZA6bTe9Q7OzleMP9OMJAO0dK7vDYeJO_9sMXS6FwX82rF41Plbrs5wc_u8BRsKfV_l8FXcVlfd842Jk62P0y2sawjN2cgAIGfBZ-P0f1tBBoLUQIK15g-lguNwCA',
  'product-checkout-ghost.jpg': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsfiMsC4UHtWtCXQusYs6wnI6R0n5r2n6wurDQrmEntKG-pm475jmQBfUPCVcTh4SklubtXBulw36zgr6-DPvqZ9Neyh6odJQW02-wxhMSmqgNtkTGH3_zzLyMxqKlKOctuS7vkC57YZvcDIdiuqynAD-VIAomWQ5ZilzcGJiA62SHXAPtK3hYRad0SJ9QxEdNzFb1rYNNDq1fhal9kbfse_GbX5VPeOrFE70XHVZxwZ0CxcxJgZu_rg'
};

const FONTS = [
  { id: 'barlow-condensed', variants: ['600', '700', '800', '900', '900italic'] },
  { id: 'inter', variants: ['400', '600', '700'] },
  { id: 'jetbrains-mono', variants: ['600'] }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    http.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        download(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' status code: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const publicDir = path.join(__dirname, '..', 'public');
  const imagesDir = path.join(publicDir, 'images');
  const fontsDir = path.join(publicDir, 'fonts');

  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
  if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

  console.log('Downloading images...');
  for (const [name, url] of Object.entries(IMAGES)) {
    const dest = path.join(imagesDir, name);
    try {
      console.log(`Downloading ${name}...`);
      await download(url, dest);
    } catch (e) {
      console.error(`Error downloading image ${name}:`, e.message);
    }
  }

  console.log('Downloading fonts...');
  for (const font of FONTS) {
    console.log(`Fetching variants for ${font.id}...`);
    try {
      const metadata = await fetchJson(`https://gwfh.mranftl.com/api/fonts/${font.id}`);
      const variantsToDownload = metadata.variants.filter(v => font.variants.includes(v.id));
      
      for (const variant of variantsToDownload) {
        const url = variant.woff2;
        const fontName = `${font.id}-${variant.id}.woff2`;
        const dest = path.join(fontsDir, fontName);
        console.log(`Downloading font ${fontName}...`);
        await download(url, dest);
      }
    } catch (e) {
      console.error(`Error downloading font family ${font.id}:`, e.message);
    }
  }
  
  console.log('All downloads completed successfully!');
}

run().catch(console.error);
