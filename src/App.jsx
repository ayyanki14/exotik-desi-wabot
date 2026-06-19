import { useState, useRef, useEffect } from "react";
import { Send, ShoppingBag, CheckCircle, Wifi, Battery, Signal, Globe } from "lucide-react";

// ── Product catalog ──────────────────────────────────────────────────
const PRODUCTS = {
  "toor dal": { name:"Toor Dal", weight:"4lb", price:6.00 },
  "urad gota": { name:"Urad Gota", weight:"4lb", price:6.00 },
  "idli ravva": { name:"Idli Ravva", weight:"4lb", price:5.50 },
  "dalia split": { name:"Dalia Split", weight:"2lb", price:3.00 },
  "kala chana": { name:"Kala Chana", weight:"2lb", price:3.00 },
  "moong dal": { name:"Moong Dal", weight:"4lb", price:8.00 },
  "chana dal": { name:"Chana Dal", weight:"4lb", price:6.00 },
  "masoor dal": { name:"Masoor Dal", weight:"4lb", price:5.50 },
  "peanuts": { name:"Peanuts Premium", weight:"3.5lb", price:8.00 },
  "makhana": { name:"Phool Makhana", weight:"200g", price:8.00 },
  "yellow vatana": { name:"Yellow Vatana", weight:"4lb", price:5.00 },
  "green vatana": { name:"Green Vatana", weight:"4lb", price:5.00 },
  "kabuli chana": { name:"Kabuli Chana", weight:"4lb", price:6.50 },
  "moong whole": { name:"Moong Whole", weight:"4lb", price:6.50 },
  "rajma": { name:"Rajma Chitra", weight:"4lb", price:7.00 },
  "chakki atta": { name:"Chakki Atta", weight:"20lb", price:18.00 },
  "atta": { name:"Chakki Atta", weight:"20lb", price:18.00 },
  "basmati rice": { name:"Basmati Rice", weight:"10lb", price:12.00 },
  "aged basmati": { name:"Aged Basmati Rice", weight:"10lb", price:13.00 },
  "basmati": { name:"Aged Basmati Rice", weight:"10lb", price:13.00 },
  "ponni rice": { name:"Ponni Boiled Rice", weight:"20lb", price:19.00 },
  "ponni": { name:"Ponni Boiled Rice", weight:"20lb", price:19.00 },
  "idli rice": { name:"Idli Rice", weight:"20lb", price:18.00 },
  "sorghum": { name:"Sorghum Jowar", weight:"5lb", price:7.00 },
  "jowar": { name:"Sorghum Jowar", weight:"5lb", price:7.00 },
  "bajra": { name:"Pearl Millet Bajra", weight:"5lb", price:10.00 },
  "pearl millet": { name:"Pearl Millet Bajra", weight:"5lb", price:10.00 },
  "kodri": { name:"Kodri Millets", weight:"4lb", price:5.50 },
  "amla": { name:"Amla Fruit Powder", weight:"16oz", price:13.50 },
  "ashwagandha": { name:"Ashwagandha Powder", weight:"16oz", price:15.50 },
  "beetroot": { name:"Beet Root Powder", weight:"8oz", price:9.00 },
  "ginger powder": { name:"Ginger Root Powder", weight:"8oz", price:10.00 },
  "haritaki": { name:"Haritaki Powder", weight:"4oz", price:6.00 },
  "lemongrass": { name:"Lemongrass Tea", weight:"4oz", price:7.50 },
  "moringa": { name:"Moringa Leaf Powder", weight:"8oz", price:10.50 },
  "mucuna": { name:"Mucuna Powder", weight:"8oz", price:9.00 },
  "neem": { name:"Neem Leaf Powder", weight:"8oz", price:9.00 },
  "rose petal": { name:"Rose Petal Powder", weight:"8oz", price:13.00 },
  "shatavari": { name:"Shatavari Root", weight:"8oz", price:12.00 },
  "triphala": { name:"Triphala Powder", weight:"4oz", price:6.00 },
  "turmeric": { name:"Turmeric Powder", weight:"8oz", price:8.00 },
};

const COMING_SOON = ["mango pickle","gongura pickle","tomato pickle","red chilli pickle","idli karam","nalla karam","karam powder","henna","hibiscus","finger millet","ragi"];
const FREE_THRESHOLD = 40;

// ── Languages ────────────────────────────────────────────────────────
const LANGS = {
  en: { label:"English", flag:"🇺🇸" },
  te: { label:"తెలుగు", flag:"🇮🇳" },
  hi: { label:"हिंदी", flag:"🇮🇳" },
  ta: { label:"தமிழ்", flag:"🇮🇳" },
};

const T = {
  en: {
    welcome: "Namaste! 🙏 Welcome to Exotik-Desi!\n\nI can help you:\n• Order groceries\n• Check prices\n• Ask about delivery\n\nWhat can I get for you today?",
    menu: "Here's what we carry:\n\n🫘 Dals & Pulses — Toor Dal $6, Moong Dal $8, Chana Dal $6\n\n🌾 Flour — Chakki Atta 20lb $18\n\n🍚 Rice — Basmati $12, Aged Basmati $13, Ponni $19\n\n🌿 Millets — Jowar $7, Bajra $10, Kodri $5.50\n\n🌱 Herbal — Ashwagandha $15.50, Amla $13.50, Moringa $10.50\n\nWhat would you like to order?",
    orderConfirm: (items, total, note) => `Got it! Here's your order:\n\n${items}\n\nSubtotal: $${total.toFixed(2)}\n${note}\n\nDelivery or Pickup? 🙏`,
    askAddress: "Please share your delivery address 📍",
    confirmed: (items, addr, total, link) => `✅ Order confirmed!\n\n${items}\n\nDelivery to: ${addr}\nTotal: $${total.toFixed(2)}\n\nPay here: ${link}\n\nWe'll deliver within 2-3 hours 📦 🙏`,
    confirmedPickup: (items, total, link) => `✅ Order confirmed!\n\n${items}\n\nTotal: $${total.toFixed(2)}\nPickup: Monmouth Junction\n\nPay here: ${link}\n\nSee you soon! 🙏`,
    comingSoon: (item) => `${item} is coming very soon! 🙏\n\nShall I add you to the notify list?\n\nReply "Yes notify me" 😊`,
    notified: "✅ Added to notify list! You'll be the first to know 🙏\n\nAnything else?",
    freeDelivery: (t) => `Free delivery included ✅`,
    paidDelivery: (t) => `Delivery fee: $4.99 (free over $${FREE_THRESHOLD})`,
    deliveryInfo: `Delivery is free on orders over $${FREE_THRESHOLD} 🎉\n\nUnder $${FREE_THRESHOLD}: $4.99 delivery fee.\nPickup is always free 🙏`,
    thanks: "You're most welcome! 🙏\n\nHappy to help anytime. Have a wonderful day! 😊",
    modePrompt: "Please reply Delivery or Pickup 🙏",
    fallback: "I can help you order groceries, check prices, or ask about delivery 🙏\n\nTry:\n• \"I want Toor Dal\"\n• \"How much is Ashwagandha?\"\n• \"Do you deliver?\"",
    priceCheck: (p) => `${p.name} (${p.weight}) is $${p.price.toFixed(2)} 🙏\n\nWould you like to order?`,
    quickReplies: [["👋 Hi","Hi"],["Menu","What products do you have?"],["Order dal","I want 2x Toor Dal and 1x Moong Dal"],["Order wellness","I want Ashwagandha powder and Moringa"],["Pickle?","Do you have Mango pickle?"],["Full order","I want Toor Dal, Aged Basmati and Ashwagandha"]],
    greetWords: ["hi","hello","hey","namaste","hii"],
    menuWords: ["menu","what do you have","what products","list","show me"],
    deliveryWords: ["deliver","home","address","send"],
    pickupWords: ["pickup","pick up","collect"],
    notifyWords: ["yes notify","notify me","yes"],
    orderWords: ["want","order","buy","get me","need"],
    priceWords: ["price","how much","cost"],
    thankWords: ["thank","thanks","thx"],
    deliveryInfoWords: ["delivery free","free delivery","delivery fee","delivery charge"],
  },
  te: {
    welcome: "నమస్కారం! 🙏 Exotik-Desi కి స్వాగతం!\n\nనేను మీకు సహాయపడగలను:\n• కిరాణా సామాగ్రి ఆర్డర్ చేయడం\n• ధరలు చెక్ చేయడం\n• డెలివరీ గురించి అడగడం\n\nఏమి కావాలి అన్నా? 😊",
    menu: "మా దగ్గర ఉన్నవి:\n\n🫘 పప్పులు — కందిపప్పు $6, పెసరపప్పు $8, శనగపప్పు $6\n\n🌾 పిండి — చక్కీ అట్టా 20lb $18\n\n🍚 బియ్యం — బాస్మతి $12, పొన్ని $19\n\n🌿 చిరుధాన్యాలు — జొన్నలు $7, సజ్జలు $10\n\n🌱 ఆయుర్వేద — అశ్వగంధ $15.50, ఉసిరికాయ $13.50, మునగ $10.50\n\nఏమి ఆర్డర్ చేయాలనుకుంటున్నారు?",
    orderConfirm: (items, total, note) => `సరే! మీ ఆర్డర్:\n\n${items}\n\nమొత్తం: $${total.toFixed(2)}\n${note}\n\nడెలివరీ కావాలా లేదా పికప్ కావాలా? 🙏`,
    askAddress: "మీ డెలివరీ అడ్రస్ చెప్పండి 📍",
    confirmed: (items, addr, total, link) => `✅ ఆర్డర్ confirm అయింది!\n\n${items}\n\nడెలివరీ: ${addr}\nమొత్తం: $${total.toFixed(2)}\n\nపేమెంట్ లింక్: ${link}\n\n2-3 గంటల్లో వస్తుంది 📦 🙏`,
    confirmedPickup: (items, total, link) => `✅ ఆర్డర్ confirm అయింది!\n\n${items}\n\nమొత్తం: $${total.toFixed(2)}\nపికప్: Monmouth Junction\n\nపేమెంట్: ${link}\n\nత్వరలో కలుద్దాం! 🙏`,
    comingSoon: (item) => `${item} త్వరలో వస్తుంది! 🙏\n\nవచ్చినప్పుడు WhatsApp చేయమంటారా?\n\n"అవును" అని reply చేయండి 😊`,
    notified: "✅ మీ పేరు జాబితాలో చేర్చాను! వచ్చినప్పుడు తప్పకుండా చెప్తాను 🙏\n\nఇంకేమైనా కావాలా?",
    freeDelivery: () => `ఉచిత డెలివరీ ✅`,
    paidDelivery: () => `డెలివరీ చార్జ్: $4.99 ($${FREE_THRESHOLD} పైన ఉచితం)`,
    deliveryInfo: `$${FREE_THRESHOLD} పైన ఆర్డర్ చేస్తే డెలివరీ ఉచితం 🎉\n\nతక్కువ అయితే $4.99 చార్జ్ ఉంటుంది.\nపికప్ ఎప్పుడూ ఉచితమే 🙏`,
    thanks: "చాలా సంతోషం! 🙏\n\nమళ్ళీ రండి. మీకు మంచి రోజు కావాలని కోరుకుంటున్నాను! 😊",
    modePrompt: "డెలివరీ కావాలా లేదా పికప్ కావాలా? 🙏",
    fallback: "నేను మీకు సహాయపడగలను 🙏\n\nఉదా:\n• \"కందిపప్పు కావాలి\"\n• \"అశ్వగంధ ధర ఎంత?\"\n• \"డెలివరీ ఉంటుందా?\"",
    priceCheck: (p) => `${p.name} (${p.weight}) ధర $${p.price.toFixed(2)} 🙏\n\nఆర్డర్ చేయాలా?`,
    quickReplies: [["👋 నమస్కారం","నమస్కారం"],["మెను చూపించు","మీ దగ్గర ఏమి ఉన్నాయి?"],["పప్పు ఆర్డర్","కందిపప్పు 2 కావాలి"],["ఆయుర్వేద","అశ్వగంధ మరియు మునగ కావాలి"],["పచ్చడి?","మామిడి పచ్చడి ఉందా?"],["పూర్తి ఆర్డర్","కందిపప్పు, బాస్మతి మరియు అశ్వగంధ కావాలి"]],
    greetWords: ["నమస్కారం","హాయ్","hello","hi","namaste"],
    menuWords: ["మెను","ఏమి ఉన్నాయి","చూపించు","list"],
    deliveryWords: ["డెలివరీ","ఇంటికి","అడ్రస్","పంపించు"],
    pickupWords: ["పికప్","తీసుకుంటా","collect"],
    notifyWords: ["అవును","yes","చెప్పు","notify"],
    orderWords: ["కావాలి","ఆర్డర్","కొనాలి","want","order"],
    priceWords: ["ధర","ఎంత","price","cost"],
    thankWords: ["ధన్యవాదాలు","thanks","thank"],
    deliveryInfoWords: ["డెలివరీ","delivery"],
  },
  hi: {
    welcome: "नमस्ते! 🙏 Exotik-Desi में आपका स्वागत है!\n\nमैं आपकी मदद कर सकता हूँ:\n• किराना सामान ऑर्डर करना\n• कीमतें जाँचना\n• डिलीवरी के बारे में पूछना\n\nआज क्या चाहिए भाई? 😊",
    menu: "हमारे पास यह सब है:\n\n🫘 दाल — तूर दाल $6, मूंग दाल $8, चना दाल $6\n\n🌾 आटा — चक्की आटा 20lb $18\n\n🍚 चावल — बासमती $12, पुरानी बासमती $13, पोन्नी $19\n\n🌿 बाजरा — जवार $7, बाजरा $10\n\n🌱 आयुर्वेदिक — अश्वगंधा $15.50, आँवला $13.50, मोरिंगा $10.50\n\nक्या ऑर्डर करना है?",
    orderConfirm: (items, total, note) => `ठीक है! आपका ऑर्डर:\n\n${items}\n\nकुल: $${total.toFixed(2)}\n${note}\n\nडिलीवरी चाहिए या पिकअप? 🙏`,
    askAddress: "अपना डिलीवरी पता बताइए 📍",
    confirmed: (items, addr, total, link) => `✅ ऑर्डर confirm हो गया!\n\n${items}\n\nडिलीवरी: ${addr}\nकुल: $${total.toFixed(2)}\n\nपेमेंट यहाँ करें: ${link}\n\n2-3 घंटे में पहुँचेगा 📦 🙏`,
    confirmedPickup: (items, total, link) => `✅ ऑर्डर confirm हो गया!\n\n${items}\n\nकुल: $${total.toFixed(2)}\nपिकअप: Monmouth Junction\n\nपेमेंट: ${link}\n\nजल्दी मिलते हैं! 🙏`,
    comingSoon: (item) => `${item} जल्दी आने वाला है! 🙏\n\nक्या मैं आपको notify list में जोड़ूँ?\n\n"हाँ" reply करें 😊`,
    notified: "✅ आपको notify list में जोड़ दिया! जैसे ही आएगा बता दूँगा 🙏\n\nकुछ और चाहिए?",
    freeDelivery: () => `डिलीवरी मुफ्त ✅`,
    paidDelivery: () => `डिलीवरी शुल्क: $4.99 ($${FREE_THRESHOLD} से ऊपर मुफ्त)`,
    deliveryInfo: `$${FREE_THRESHOLD} से ऊपर ऑर्डर पर डिलीवरी मुफ्त 🎉\n\nकम होने पर $4.99 लगेगा।\nपिकअप हमेशा मुफ्त 🙏`,
    thanks: "बहुत शुक्रिया! 🙏\n\nकभी भी आइए। आपका दिन अच्छा हो! 😊",
    modePrompt: "डिलीवरी चाहिए या पिकअप? 🙏",
    fallback: "मैं मदद कर सकता हूँ 🙏\n\nजैसे:\n• \"तूर दाल चाहिए\"\n• \"अश्वगंधा कितने का है?\"\n• \"डिलीवरी होती है?\"",
    priceCheck: (p) => `${p.name} (${p.weight}) की कीमत $${p.price.toFixed(2)} है 🙏\n\nऑर्डर करना है?`,
    quickReplies: [["👋 नमस्ते","नमस्ते"],["मेनू","क्या क्या है आपके पास?"],["दाल ऑर्डर","2 तूर दाल और 1 मूंग दाल चाहिए"],["आयुर्वेद","अश्वगंधा और मोरिंगा चाहिए"],["अचार?","मैंगो अचार है क्या?"],["पूरा ऑर्डर","तूर दाल, बासमती और अश्वगंधा चाहिए"]],
    greetWords: ["नमस्ते","हाय","hello","hi","namaste","हैलो"],
    menuWords: ["मेनू","क्या है","दिखाओ","list","सामान"],
    deliveryWords: ["डिलीवरी","घर","पता","भेजो","deliver"],
    pickupWords: ["पिकअप","ले जाऊँगा","collect","pickup"],
    notifyWords: ["हाँ","yes","बताओ","notify"],
    orderWords: ["चाहिए","ऑर्डर","लेना","want","order","खरीदना"],
    priceWords: ["कीमत","कितना","price","cost","दाम"],
    thankWords: ["शुक्रिया","धन्यवाद","thanks","thank"],
    deliveryInfoWords: ["डिलीवरी","delivery","मुफ्त"],
  },
  ta: {
    welcome: "வணக்கம்! 🙏 Exotik-Desi-க்கு வரவேற்கிறோம்!\n\nநான் உங்களுக்கு உதவ முடியும்:\n• மளிகை சாமான்கள் ஆர்டர் செய்வது\n• விலை பார்ப்பது\n• டெலிவரி பற்றி கேட்பது\n\nஎன்ன வேண்டும்? 😊",
    menu: "எங்களிடம் இருப்பவை:\n\n🫘 பருப்பு — துவரம் பருப்பு $6, பாசிப்பருப்பு $8\n\n🌾 மாவு — சக்கி ஆட்டா 20lb $18\n\n🍚 அரிசி — பாஸ்மதி $12, பொன்னி $19\n\n🌿 சிறுதானியங்கள் — ஜோவர் $7, கம்பு $10\n\n🌱 மூலிகை — அஸ்வகந்தா $15.50, நெல்லிக்காய் $13.50, முருங்கை $10.50\n\nஆர்டர் செய்யலாமா?",
    orderConfirm: (items, total, note) => `சரி! உங்கள் ஆர்டர்:\n\n${items}\n\nமொத்தம்: $${total.toFixed(2)}\n${note}\n\nடெலிவரி வேண்டுமா அல்லது பிக்அப்? 🙏`,
    askAddress: "உங்கள் டெலிவரி முகவரி சொல்லுங்கள் 📍",
    confirmed: (items, addr, total, link) => `✅ ஆர்டர் உறுதிப்படுத்தப்பட்டது!\n\n${items}\n\nடெலிவரி: ${addr}\nமொத்தம்: $${total.toFixed(2)}\n\nகட்டணம்: ${link}\n\n2-3 மணி நேரத்தில் வரும் 📦 🙏`,
    confirmedPickup: (items, total, link) => `✅ ஆர்டர் உறுதிப்படுத்தப்பட்டது!\n\n${items}\n\nமொத்தம்: $${total.toFixed(2)}\nபிக்அப்: Monmouth Junction\n\nகட்டணம்: ${link}\n\nசீக்கிரம் சந்திப்போம்! 🙏`,
    comingSoon: (item) => `${item} விரைவில் வரும்! 🙏\n\nவந்தவுடன் WhatsApp செய்யட்டுமா?\n\n"ஆம்" என்று reply செய்யுங்கள் 😊`,
    notified: "✅ பட்டியலில் சேர்த்துவிட்டேன்! வந்தவுடன் தெரிவிக்கிறேன் 🙏\n\nவேறு ஏதாவது வேண்டுமா?",
    freeDelivery: () => `டெலிவரி இலவசம் ✅`,
    paidDelivery: () => `டெலிவரி கட்டணம்: $4.99 ($${FREE_THRESHOLD}-க்கு மேல் இலவசம்)`,
    deliveryInfo: `$${FREE_THRESHOLD}-க்கு மேல் ஆர்டர் செய்தால் டெலிவரி இலவசம் 🎉\n\nகுறைவாக இருந்தால் $4.99.\nபிக்அப் எப்போதும் இலவசம் 🙏`,
    thanks: "மிக்க நன்றி! 🙏\n\nதிரும்பவும் வாருங்கள். நல்ல நாளாக இருக்கட்டும்! 😊",
    modePrompt: "டெலிவரி வேண்டுமா அல்லது பிக்அப்? 🙏",
    fallback: "நான் உதவ முடியும் 🙏\n\nஉதாரணமாக:\n• \"துவரம் பருப்பு வேண்டும்\"\n• \"அஸ்வகந்தா விலை என்ன?\"\n• \"டெலிவரி இருக்கா?\"",
    priceCheck: (p) => `${p.name} (${p.weight}) விலை $${p.price.toFixed(2)} 🙏\n\nஆர்டர் செய்யலாமா?`,
    quickReplies: [["👋 வணக்கம்","வணக்கம்"],["மெனு","என்னென்ன இருக்கு?"],["பருப்பு","துவரம் பருப்பு 2 வேண்டும்"],["மூலிகை","அஸ்வகந்தா மற்றும் முருங்கை வேண்டும்"],["ஊறுகாய்?","மாம்பழ ஊறுகாய் இருக்கா?"],["முழு ஆர்டர்","துவரம் பருப்பு, பாஸ்மதி மற்றும் அஸ்வகந்தா வேண்டும்"]],
    greetWords: ["வணக்கம்","hello","hi","namaste","ஹாய்"],
    menuWords: ["மெனு","என்னென்ன","காட்டு","list"],
    deliveryWords: ["டெலிவரி","வீட்டுக்கு","முகவரி","deliver"],
    pickupWords: ["பிக்அப்","வருவேன்","collect","pickup"],
    notifyWords: ["ஆம்","yes","சொல்லு","notify"],
    orderWords: ["வேண்டும்","ஆர்டர்","வாங்க","want","order"],
    priceWords: ["விலை","எவ்வளவு","price","cost"],
    thankWords: ["நன்றி","thanks","thank"],
    deliveryInfoWords: ["டெலிவரி","delivery","இலவசம்"],
  },
};

function randId() { return Math.floor(1000+Math.random()*9000); }

function parseOrder(text) {
  const lower = text.toLowerCase();
  const found = [];
  for (const [key, product] of Object.entries(PRODUCTS)) {
    if (lower.includes(key)) {
      const qtyMatch = lower.match(new RegExp(`(\\d+)\\s*[x×]?\\s*${key}`)) ||
                       lower.match(new RegExp(`${key}\\s*[x×]?\\s*(\\d+)`));
      const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;
      if (!found.find(f => f.name === product.name)) {
        found.push({ ...product, qty });
      }
    }
  }
  return found;
}

function isComingSoon(text) {
  const lower = text.toLowerCase();
  return COMING_SOON.find(item => lower.includes(item));
}

function calcTotal(items) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}

function formatOrder(items) {
  return items.map(i => `• ${i.qty}× ${i.name} (${i.weight}) — $${(i.price*i.qty).toFixed(2)}`).join("\n");
}

function botReply(text, state, setState, lang) {
  const t = T[lang];
  const lower = text.toLowerCase();

  const has = (words) => words.some(w => lower.includes(w));

  if (state.step==="idle" && has(t.greetWords)) {
    return t.welcome;
  }

  if (has(t.menuWords)) return t.menu;

  if (has(t.priceWords)) {
    const items = parseOrder(lower);
    if (items.length > 0) return t.priceCheck(items[0]);
    return t.fallback;
  }

  const soonItem = isComingSoon(lower);
  if (soonItem && !has(t.orderWords)) {
    setState(s=>({...s, step:"awaitNotify"}));
    const item = soonItem.charAt(0).toUpperCase()+soonItem.slice(1);
    return t.comingSoon(item);
  }

  if (has(t.notifyWords) && state.step==="awaitNotify") {
    setState(s=>({...s, step:"idle"}));
    return t.notified;
  }

  if (has(t.orderWords) && soonItem) {
    setState(s=>({...s, step:"awaitNotify"}));
    const item = soonItem.charAt(0).toUpperCase()+soonItem.slice(1);
    return t.comingSoon(item);
  }

  if (state.step==="idle" || state.step==="ordering") {
    const items = parseOrder(lower);
    if (items.length > 0) {
      const total = calcTotal(items);
      const note = total >= FREE_THRESHOLD ? t.freeDelivery() : t.paidDelivery();
      setState(s=>({...s, step:"askedMode", pendingOrder:items, total}));
      return t.orderConfirm(formatOrder(items), total, note);
    }
  }

  if (state.step==="askedMode") {
    if (has(t.pickupWords)) {
      const id = randId();
      const total = state.total;
      setState(s=>({...s, step:"idle", pendingOrder:null}));
      return t.confirmedPickup(formatOrder(state.pendingOrder), total, `pay.stripe.com/exotikdesi/${id}`);
    }
    if (has(t.deliveryWords)) {
      setState(s=>({...s, step:"askedAddress"}));
      return t.askAddress;
    }
    return t.modePrompt;
  }

  if (state.step==="askedAddress") {
    const id = randId();
    const total = state.total + (state.total >= FREE_THRESHOLD ? 0 : 4.99);
    setState(s=>({...s, step:"idle", pendingOrder:null}));
    return t.confirmed(formatOrder(state.pendingOrder), text, total, `pay.stripe.com/exotikdesi/${id}`);
  }

  if (has(t.deliveryInfoWords)) return t.deliveryInfo;
  if (has(t.thankWords)) return t.thanks;

  return t.fallback;
}

const TIME = () => new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:true});

export default function App() {
  const [lang, setLang]       = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const [messages, setMessages] = useState([{
    role:"bot", text:T.en.welcome, time:TIME(), status:"read",
  }]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [botState, setBotState] = useState({step:"idle", pendingOrder:null, total:0});
  const bottomRef             = useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,loading]);

  const switchLang = (l) => {
    setLang(l);
    setLangOpen(false);
    setBotState({step:"idle", pendingOrder:null, total:0});
    setMessages([{role:"bot", text:T[l].welcome, time:TIME(), status:"read"}]);
  };

  const send = (text) => {
    const t = (text||input).trim();
    if (!t||loading) return;
    setInput("");
    const userMsg = {role:"user", text:t, time:TIME()};
    setMessages(m=>[...m, userMsg]);
    setLoading(true);
    setTimeout(() => {
      let newState = {...botState};
      const reply = botReply(t, newState, (updater)=>{ newState = updater(newState); }, lang);
      setBotState(newState);
      setMessages(m=>[...m,{role:"bot", text:reply, time:TIME(), status:"read"}]);
      setLoading(false);
    }, 500+Math.random()*500);
  };

  const onKey = e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} };
  const qr = T[lang].quickReplies;

  return (
    <div style={{maxWidth:390,margin:"0 auto",height:"100vh",display:"flex",flexDirection:"column",fontFamily:"system-ui,-apple-system,sans-serif",background:"#000",overflow:"hidden",position:"relative"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        button{font-family:inherit;cursor:pointer;border:none;}
        textarea{font-family:inherit;resize:none;}
        ::-webkit-scrollbar{display:none;}
        .bubble{animation:pop .15s ease;}
        @keyframes pop{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
        @keyframes blink{0%,80%,100%{opacity:0}40%{opacity:1}}
      `}</style>

      {/* Status bar */}
      <div style={{background:"#075e54",padding:"8px 16px 4px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{color:"#fff",fontSize:11,fontWeight:600}}>9:41</span>
        <div style={{display:"flex",gap:5,alignItems:"center"}}>
          <Signal size={12} color="#fff"/>
          <Wifi size={12} color="#fff"/>
          <Battery size={14} color="#fff"/>
        </div>
      </div>

      {/* WA Header */}
      <div style={{background:"#075e54",padding:"8px 14px 10px",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:40,height:40,borderRadius:999,background:"linear-gradient(135deg,#7c2d12,#c2410c)",display:"grid",placeItems:"center",flexShrink:0}}>
          <ShoppingBag size={18} color="#fff"/>
        </div>
        <div style={{flex:1}}>
          <div style={{color:"#fff",fontWeight:700,fontSize:15}}>Exotik-Desi 🛒</div>
          <div style={{color:"#b2dfdb",fontSize:11}}>Monmouth Junction · Online</div>
        </div>
        {/* Language switcher */}
        <div style={{position:"relative"}}>
          <button onClick={()=>setLangOpen(o=>!o)} style={{
            background:"rgba(255,255,255,.15)",borderRadius:8,
            padding:"5px 10px",color:"#fff",fontSize:12,fontWeight:600,
            display:"flex",alignItems:"center",gap:5,
          }}>
            <Globe size={13}/> {LANGS[lang].flag} {LANGS[lang].label}
          </button>
          {langOpen&&(
            <div style={{position:"absolute",right:0,top:36,background:"#fff",borderRadius:10,boxShadow:"0 4px 20px rgba(0,0,0,.2)",overflow:"hidden",zIndex:50,minWidth:140}}>
              {Object.entries(LANGS).map(([key,l])=>(
                <button key={key} onClick={()=>switchLang(key)} style={{
                  width:"100%",padding:"10px 14px",textAlign:"left",
                  background:lang===key?"#f0fdf4":"#fff",
                  color:lang===key?"#166534":"#1c1917",
                  fontWeight:lang===key?700:400,fontSize:13,
                  borderBottom:"1px solid #f0ece4",display:"flex",gap:8,alignItems:"center",
                }}>
                  <span>{l.flag}</span> {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat */}
      <div style={{
        flex:1,overflowY:"auto",background:"#e5ddd5",
        backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8bfb5' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        padding:"12px 10px",display:"flex",flexDirection:"column",gap:4,
      }}>
        <div style={{textAlign:"center",margin:"4px 0 8px"}}>
          <span style={{background:"rgba(255,255,255,.7)",fontSize:11,color:"#666",padding:"4px 12px",borderRadius:999,fontWeight:500}}>TODAY</span>
        </div>

        {messages.map((m,i)=>{
          const isBot = m.role==="bot";
          const hasPayLink = m.text.includes("pay.stripe.com");
          const payLink = hasPayLink ? m.text.match(/pay\.stripe\.com\/\S+/)?.[0] : null;
          const cleanText = hasPayLink ? m.text.replace(/pay\.stripe\.com\/\S+/g,"[PAYMENT LINK]") : m.text;
          return (
            <div key={i} className="bubble" style={{display:"flex",justifyContent:isBot?"flex-start":"flex-end",marginBottom:2}}>
              <div style={{
                maxWidth:"82%",background:isBot?"#fff":"#dcf8c6",
                borderRadius:isBot?"0 10px 10px 10px":"10px 0 10px 10px",
                padding:"8px 10px 6px",boxShadow:"0 1px 2px rgba(0,0,0,.12)",position:"relative",
              }}>
                <div style={{position:"absolute",top:0,[isBot?"left":"right"]:-7,width:0,height:0,borderStyle:"solid",
                  borderWidth:isBot?"0 8px 8px 0":"0 0 8px 8px",
                  borderColor:isBot?"transparent #fff transparent transparent":"transparent transparent transparent #dcf8c6",
                }}/>
                <div style={{fontSize:13.5,color:"#111",lineHeight:1.55,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                  {cleanText}
                </div>
                {payLink&&(
                  <div style={{marginTop:8,background:"#f0fdf4",border:"1px solid #86efac",borderRadius:8,padding:"8px 10px"}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#166534",marginBottom:3}}>💳 Secure Payment</div>
                    <div style={{fontSize:12,color:"#16a34a",wordBreak:"break-all"}}>{payLink}</div>
                    <div style={{fontSize:10,color:"#166534",marginTop:2}}>Stripe · SSL 🔒</div>
                  </div>
                )}
                <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:3,marginTop:3}}>
                  <span style={{fontSize:10,color:"#999"}}>{m.time}</span>
                  {!isBot&&<CheckCircle size={12} color={m.status==="read"?"#53bdeb":"#999"}/>}
                </div>
              </div>
            </div>
          );
        })}

        {loading&&(
          <div style={{display:"flex",justifyContent:"flex-start"}}>
            <div style={{background:"#fff",borderRadius:"0 10px 10px 10px",padding:"10px 14px",boxShadow:"0 1px 2px rgba(0,0,0,.12)",display:"flex",gap:4,alignItems:"center"}}>
              {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:999,background:"#aaa",animation:`blink 1.2s ${i*0.2}s infinite`}}/>)}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Quick replies */}
      <div style={{background:"#f0f0f0",padding:"8px 10px",display:"flex",gap:6,overflowX:"auto",flexWrap:"nowrap",msOverflowStyle:"none",scrollbarWidth:"none"}}>
        {qr.map(([label,msg])=>(
          <button key={label} onClick={()=>send(msg)} style={{
            flexShrink:0,background:"#fff",border:"1px solid #ccc",
            borderRadius:999,padding:"5px 12px",fontSize:12,color:"#075e54",fontWeight:600,whiteSpace:"nowrap",
          }}>{label}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{background:"#f0f0f0",padding:"8px 10px",display:"flex",gap:8,alignItems:"flex-end"}}>
        <div style={{flex:1,background:"#fff",borderRadius:24,padding:"10px 14px",display:"flex",alignItems:"center",boxShadow:"0 1px 3px rgba(0,0,0,.1)"}}>
          <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey}
            placeholder="Type a message…" rows={1}
            style={{flex:1,border:"none",outline:"none",fontSize:14,color:"#111",background:"transparent",lineHeight:1.4,maxHeight:80}}/>
        </div>
        <button onClick={()=>send()} disabled={!input.trim()||loading} style={{
          width:46,height:46,borderRadius:999,flexShrink:0,
          background:input.trim()&&!loading?"#075e54":"#ccc",
          display:"grid",placeItems:"center",transition:"background .15s",
        }}>
          <Send size={18} color="#fff"/>
        </button>
      </div>
      <div style={{background:"#f0f0f0",height:6}}/>
    </div>
  );
}
