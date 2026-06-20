/* ====================================================================
   جلب قائمة المنتجات ديناميكياً من Google Sheet عبر SheetDB
==================================================================== */

// مصفوفة فارغة سيتم ملؤها تلقائياً بالمنتجات القادمة من الشيت
let PRODUCTS = [];

/**
 * دالة لجلب البيانات من صفحة product في الـ Google Sheet
 * وتحديث مصفوفة PRODUCTS العالمية
 */
function fetchProductsFromSheet() {
  // CONFIG.APPS_SCRIPT_URL هو رابط SheetDB الخاص بك
  // نضيف له ?sheet=product لنخبره أن يقرأ من صفحة المنتجات تحديداً
  const url = CONFIG.APPS_SCRIPT_URL + "?sheet=product";

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('خطأ في جلب المنتجات من السيرفر');
      }
      return response.json();
    })
    .then(data => {
      // تحويل البيانات القادمة من النصوص إلى صيغة يفهمها الموقع
      PRODUCTS = data.map(item => ({
        id: item.id,
        name: item.name,
        price: parseInt(item.price, 10) || 0, // تحويل السعر لرقم لحسابه لاحقاً
        description: item.description,
        icon: item.icon || "backpack",
        image: item.image || ""
      }));
      console.log("✅ تم تحميل المنتجات بنجاح من الـ Sheet:", PRODUCTS);
      return PRODUCTS;
    })
    .catch(error => {
      console.error("❌ فشل جلب المنتجات، تم الانتقال للمنتجات الاحتياطية:", error);
      // منتجات احتياطية تظهر فقط في حال انقطع الإنترنت أو حدث خلل في رابط الشيت
      PRODUCTS = [
        { 
          id: "p1", 
          name: "مضرب البعوض الإلكتروني", 
          price: 2500, 
          description: "مضرب قابل للشحن ومضاد للناموس، آمن تماماً وفعال.", 
          icon: "lamp", 
          image: "" 
        }
      ];
      return PRODUCTS;
    });
}
