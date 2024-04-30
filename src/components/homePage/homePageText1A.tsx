import React, { useState, useEffect, useContext, useRef } from 'react';
import { LanguageCodeProps } from '../../helpers/languageManager';

export default function HomePageTextOneA(props: LanguageCodeProps) {

    const isSmallScreen = window.innerWidth <= 768;

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{fontWeight: 'bold', fontSize: '40px', 
            maxWidth: '550px', marginLeft: '65px', color: '#60A05B'}}>
            {props.language === 'en' && "Store, save and earn directly from your phone with no bank account needed."}
        {props.language === 'da' && "En højafkast-opsparingskonto for alle med internet"}
        {props.language === 'de' && "Ein Sparkonto mit hoher Rendite für alle mit Internet"}
        {props.language === 'es' && "Una cuenta de ahorros de alto rendimiento para todos los que tienen Internet"}
        {props.language === 'it' && "Un conto di risparmio ad alto rendimento per tutti coloro che hanno Internet"}
        {props.language === 'pt' && "Uma conta poupança de alto rendimento para todos com internet"}
        {props.language === 'sk' && "Sporiaci účet s vysokým výnosom pre každého s internetom"}
        {props.language === 'ar' && "حساب توفير ذو عائد مرتفع لكل من لديه إنترنت"}
        {props.language === 'tr' && "İnterneti olan herkese yüksek getirili tasarruf hesabı"}
        {props.language === 'fr' && "Un compte d'épargne à haut rendement pour tous ceux qui disposent d'Internet"}
        {props.language === 'hi' && "इंटरनेट वाले प्रत्येक व्यक्ति के लिए एक उच्च उपज बचत खाता"}
        {props.language === 'zh' && "适合每个有互联网的人的高收益储蓄账户"}
        {props.language === 'id' && "Rekening tabungan hasil tinggi untuk semua orang yang memiliki internet"}
        {props.language === 'ko' && "인터넷이 있는 모든 사람을 위한 고수익 저축 계좌"}
        {props.language === 'ja' && "インターネットを持っているすべての人のための高利回り普通預金口座"}
        {props.language === 'ru' && "Высокодоходный сберегательный счет для всех, у кого есть Интернет."}
        {props.language === 'ur' && "انٹرنیٹ کے ساتھ ہر ایک کے لیے ایک اعلی پیداوار بچت اکاؤنٹ"}
        {props.language === 'fl' && "Isang mataas na ani savings account para sa lahat ng may internet"}
        {props.language === 'mr' && "इंटरनेट असलेल्या प्रत्येकासाठी उच्च उत्पन्न बचत खाते"}
        {props.language === 'te' && "ఇంటర్నెట్ ఉన్న ప్రతి ఒక్కరికీ అధిక దిగుబడి పొదుపు ఖాతా"}
        {props.language === 'ta' && "இணையம் உள்ள அனைவருக்கும் அதிக மகசூல் சேமிப்பு கணக்கு"}
        {props.language === 'vi' && "Tài khoản tiết kiệm năng suất cao dành cho mọi người có internet"}
        {props.language === 'sw' && "Akaunti ya akiba ya mavuno mengi kwa kila mtu aliye na intaneti"}
        </div>

        <div style={{fontSize: '25px', 
            maxWidth: '550px', marginLeft: '65px', 
            color: '#333333', marginTop: '15px'}}>

             {props.language === 'en' && "MyFye gives users around the world instant access to yield on their deposits, backed directly by US treasury bonds."}
        {props.language === 'da' && "Bygget på kortfristede amerikanske statsobligationer giver Myfye alle rundt om i verden adgang til sikkert, likvidt afkast uden behov for en bankkonto"}
        {props.language === 'de' && "Myfye basiert auf kurzfristigen US-Staatsanleihen und bietet jedem auf der ganzen Welt Zugang zu sicheren, liquiden Erträgen, ohne dass ein Bankkonto erforderlich ist"}
        {props.language === 'es' && "Construido sobre bonos del Tesoro de EE. UU. a corto plazo, Myfye brinda a todos en todo el mundo acceso a un rendimiento líquido y seguro sin necesidad de una cuenta bancaria."}
        {props.language === 'it' && "Basato su titoli del Tesoro statunitensi a breve termine, Myfye offre a tutti in tutto il mondo l'accesso a rendimenti liquidi e sicuri senza la necessità di un conto bancario"}
        {props.language === 'pt' && "Construído com base em títulos do Tesouro dos EUA de curto prazo, o Myfye oferece a todos em todo o mundo acesso a rendimento líquido e seguro, sem necessidade de conta bancária"}
        {props.language === 'sk' && "Myfye, postavená na krátkodobých amerických štátnych dlhopisoch, poskytuje každému na celom svete prístup k bezpečným, likvidným výnosom bez potreby bankového účtu."}
        {props.language === 'ar' && "مبني على سندات الخزانة الأمريكية قصيرة الأجل، يمنح Myfye الجميع في جميع أنحاء العالم إمكانية الوصول إلى عائد آمن وسائل دون الحاجة إلى حساب مصرفي."}
        {props.language === 'tr' && "Kısa vadeli ABD hazine tahvilleri üzerine inşa edilen Myfye, dünyanın her yerindeki herkesin banka hesabına gerek kalmadan güvenli, likit getiriye erişmesini sağlıyor"}
        {props.language === 'fr' && "Construit sur des bons du Trésor américain à court terme, Myfye donne à tous, partout dans le monde, accès à un rendement sûr et liquide sans avoir besoin de compte bancaire."}
        {props.language === 'hi' && "अल्पकालिक अमेरिकी ट्रेजरी बांड पर निर्मित, Myfye दुनिया भर में हर किसी को बिना किसी बैंक खाते के सुरक्षित, तरल उपज तक पहुंच प्रदान करता है।"}
        {props.language === 'zh' && "Myfye 以短期美国国债为基础，让世界各地的每个人无需银行账户即可获得安全、流动的收益"}
        {props.language === 'id' && "Dibangun berdasarkan obligasi negara AS jangka pendek, Myfye memberi semua orang di seluruh dunia akses terhadap hasil yang aman dan likuid tanpa perlu rekening bank"}
        {props.language === 'ko' && "단기 미국 국채를 기반으로 구축된 Myfye는 전 세계 모든 사람에게 은행 계좌 없이도 안전하고 유동적인 수익률에 대한 액세스를 제공합니다."}
        {props.language === 'ja' && "Myfye は米国の短期国債をベースに構築されており、世界中の誰もが銀行口座を必要とせずに安全で流動的な利回りへのアクセスを提供します。"}
        {props.language === 'ru' && "Основанная на краткосрочных казначейских облигациях США, Myfye предоставляет каждому во всем мире доступ к безопасной и ликвидной доходности без необходимости банковского счета."}
        {props.language === 'ur' && "قلیل مدتی امریکی ٹریژری بانڈز پر بنایا گیا، Myfye دنیا بھر میں ہر کسی کو بغیر کسی بینک اکاؤنٹ کے محفوظ، مائع پیداوار تک رسائی فراہم کرتا ہے۔"}
        {props.language === 'fl' && "Itinayo sa panandaliang mga bono ng treasury ng US, binibigyan ng Myfye ang lahat sa buong mundo ng access sa ligtas, likidong ani na walang kinakailangang bank account"}
        {props.language === 'mr' && "अल्प मुदतीच्या यूएस ट्रेझरी बाँड्सवर बनवलेले, Myfye जगभरातील प्रत्येकाला बँक खात्याची आवश्यकता नसताना सुरक्षित, तरल उत्पन्नाचा प्रवेश देते"}
        {props.language === 'te' && "స్వల్పకాలిక US ట్రెజరీ బాండ్లపై నిర్మించబడింది, Myfye ప్రపంచవ్యాప్తంగా ఉన్న ప్రతి ఒక్కరికి బ్యాంక్ ఖాతా అవసరం లేకుండా సురక్షితమైన, ద్రవ దిగుబడికి ప్రాప్యతను అందిస్తుంది"}
        {props.language === 'ta' && "குறுகிய கால அமெரிக்க கருவூலப் பத்திரங்களில் கட்டமைக்கப்பட்ட Myfye, உலகெங்கிலும் உள்ள அனைவருக்கும் பாதுகாப்பான, திரவ மகசூலைப் பெறுவதற்கான அணுகலை வழங்குகிறது."}
        {props.language === 'vi' && "Được xây dựng dựa trên trái phiếu kho bạc ngắn hạn của Hoa Kỳ, Myfye mang đến cho mọi người trên toàn thế giới khả năng tiếp cận lợi suất an toàn, thanh khoản mà không cần tài khoản ngân hàng"}
        {props.language === 'sw' && "Imejengwa kwa dhamana za muda mfupi za hazina ya Merika, Myfye inawapa kila mtu ulimwenguni ufikiaji wa mavuno salama na ya kioevu bila akaunti ya benki inayohitajika."}

        </div>
    </div>


  );
}