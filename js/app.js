/* ====================================================================
   منطق الصفحة الرئيسية: عرض المنتجات ديناميكياً بعد جلبها من الشيت
==================================================================== */

async function init() {
  try {
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle && CONFIG.storeName) {
      heroTitle.textContent = CONFIG.storeName;
    }

    // 1. انتظر جلب المنتجات من الـ Google Sheet أولاً قبل العرض
    await fetchProductsFromSheet();

    // 2. عرض المنتجات في الصفحة
    renderProducts();
  } catch (err) {
    console.error("حدث خطأ أثناء تشغيل الصفحة الرئيسية:", err);
  }
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  
  grid.innerHTML = '';

  if (PRODUCTS.length === 0) {
    grid.innerHTML = '<p class="no-products">لا توجد منتجات معروضة حالياً.</p>';
    return;
  }

  PRODUCTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="media">${getProductMedia(p)}</div>
      <div class="info">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="meta">
          <span class="price">${p.price.toLocaleString('en-US')} دج</span>
          <a href="order.html?id=${p.id}" class="btn-buy">اطلب الآن</a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function getProductMedia(p) {
  if (p.image && p.image.trim() !== "") {
    return `<img src="${p.image}" alt="${p.name}" loading="lazy">`;
  }
  const iconSvg = typeof ICONS !== 'undefined' && ICONS[p.icon] ? ICONS[p.icon] : (typeof ICONS !== 'undefined' ? ICONS['backpack'] : '');
  return `<div class="icon-placeholder">${iconSvg}</div>`;
}

document.addEventListener('DOMContentLoaded', init);
document.addEventListener('DOMContentLoaded', renderProducts);
