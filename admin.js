import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCSgvi4tyeoQKSw-o8SZ_oFms0zfjgR6kU",
    authDomain: "alhady.firebaseapp.com",
    projectId: "alhady",
    storageBucket: "alhady.firebasestorage.app",
    messagingSenderId: "839424225673",
    appId: "1:839424225673:web:4b68a4ad74e5a2526bf158",
    measurementId: "G-5GE3K43796"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const govs = ["القاهرة", "الجيزة", "الأسكندرية", "الدقهلية", "الشرقية", "المنوفية", "القليوبية", "البحيرة", "الغربية", "بور سعيد", "دمياط", "الإسماعيلية", "السويس", "كفر الشيخ", "الفيوم", "بني سويف", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان", "البحر الأحمر", "الوادي الجديد", "مطروح", "شمال سيناء", "جنوب سيناء"];
const stylesMap = { "1": "باتمان", "2": "سوبرمان", "3": "كيتي", "4": "اسبونج بوب" };

// ملء قائمة المحافظات
const govSelect = document.getElementById('govSelect');
govs.forEach(g => {
    let opt = document.createElement('option');
    opt.value = g;
    opt.innerHTML = g;
    govSelect.appendChild(opt);
});

// دالة حساب البيانات (المعاينة)
function updatePreview() {
    const gov = govSelect.value;
    const styleNum = document.getElementById('styleSelect').value;
    
    // لوجيك الحروف (انطر أبلكاش)
    let char = gov.startsWith("ال") ? gov.charAt(2) : gov.charAt(0);
    const imgName = `${char}${styleNum}.png`;
    const description = `جدول امتحانات الصف الاول الثانوي الترم الثاني محافظه ${gov} 2026 ${stylesMap[styleNum]}`;

    document.getElementById('imgNamePreview').innerText = imgName;
    document.getElementById('descPreview').innerText = description;
    return { imgName, description, gov, styleName: stylesMap[styleNum] };
}

// تحديث المعاينة عند أي تغيير
govSelect.addEventListener('change', updatePreview);
document.getElementById('styleSelect').addEventListener('change', updatePreview);
updatePreview(); // تشغيل أولي

// النشر لفايرباز
document.getElementById('publishBtn').addEventListener('click', async () => {
    const data = updatePreview();
    const status = document.getElementById('status');
    status.style.color = "var(--primary)";
    status.innerText = "جاري النشر كدسه...";

    try {
        await addDoc(collection(db, "schedules"), {
            imageName: data.imgName,
            govName: data.gov,
            styleName: data.styleName,
            fullDescription: data.description,
            createdAt: serverTimestamp()
        });
        status.style.color = "#4ade80";
        status.innerText = "انطر أبلكاش! الجدول نزل يا مدلع ✅";
    } catch (e) {
        status.style.color = "#f87171";
        status.innerText = "لي كدسه؟ حصل غلط!";
        console.error(e);
    }
});
