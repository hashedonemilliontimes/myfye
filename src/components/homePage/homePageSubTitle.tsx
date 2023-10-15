import React, { useState, useEffect, useContext, useRef } from 'react';
import { LanguageCodeProps } from '../../helpers/languageManager';

export default function HomePageSubTitle(props: LanguageCodeProps) {

    const isSmallScreen = window.innerWidth <= 768;

  return (
    <>
    <div className={'fade-in-animation'} style={{fontSize: isSmallScreen ? '20px' : '25px', 
    marginTop: '25px', width: '56%'}}>
    
    {props.language === 'en' && "With MyFye, you can invest in U.S. governemnt treasuries by Linking your Solana wallet and depositing USDC."}
        {props.language === 'da' && "Med MyFye kan du investere i amerikanske statslige statsobligationer ved at forbinde din Solana-pung og indbetale USDC."}
        {props.language === 'de' && "Mit MyFye können Sie in US-Staatsanleihen investieren, indem Sie Ihr Solana-Wallet verknüpfen und USDC einzahlen."}
        {props.language === 'es' && "Con MyFye, puede invertir en bonos del tesoro del gobierno de EE. UU. vinculando su billetera Solana y depositando USDC."}
        {props.language === 'it' && "Con MyFye puoi investire in titoli del Tesoro del governo statunitense collegando il tuo portafoglio Solana e depositando USDC."}
        {props.language === 'pt' && "Com o MyFye, você pode investir em títulos do governo dos EUA vinculando sua carteira Solana e depositando USDC."}
        {props.language === 'sk' && "S MyFye môžete investovať do štátnych pokladníc USA prepojením peňaženky Solana a vkladom USDC."}
        {props.language === 'ar' && "مع MyFye، يمكنك الاستثمار في سندات الخزانة الحكومية الأمريكية عن طريق ربط محفظة Solana الخاصة بك وإيداع USDC."}
        {props.language === 'tr' && "MyFye ile Solana cüzdanınızı bağlayarak ve USDC yatırarak ABD devlet hazinelerine yatırım yapabilirsiniz."}
        {props.language === 'fr' && "Avec MyFye, vous pouvez investir dans les bons du Trésor américain en reliant votre portefeuille Solana et en déposant des USDC."}
        {props.language === 'hi' && "MyFye के साथ, आप अपने सोलाना वॉलेट को लिंक करके और यूएसडीसी जमा करके अमेरिकी सरकारी खजाने में निवेश कर सकते हैं।"}
        {props.language === 'zh' && "借助 MyFye，您可以通过链接 Solana 钱包并存入 USDC 来投资美国政府国库券。"}
        {props.language === 'id' && "Dengan MyFye, Anda dapat berinvestasi di kas pemerintah AS dengan Menghubungkan dompet Solana Anda dan menyetorkan USDC."}
        {props.language === 'ko' && "MyFye를 사용하면 솔라나 지갑을 연결하고 USDC를 입금하여 미국 정부 국채에 투자할 수 있습니다."}
        {props.language === 'ja' && "MyFye を使用すると、Solana ウォレットをリンクして USDC を入金することで、米国政府の財務省に投資できます。"}
        {props.language === 'ru' && "С MyFye вы можете инвестировать в казначейские облигации правительства США, привязав свой кошелек Solana и внеся депозит в долларах США."}
        {props.language === 'ur' && "MyFye کے ساتھ، آپ اپنے سولانا والیٹ کو لنک کرکے اور USDC جمع کر کے امریکی حکومت کے خزانے میں سرمایہ کاری کر سکتے ہیں۔"}
        {props.language === 'fl' && "Sa MyFye, maaari kang mamuhunan sa mga treasuries ng pamahalaan ng U.S. sa pamamagitan ng Pag-link ng iyong Solana wallet at pagdedeposito ng USDC."}
        {props.language === 'mr' && "MyFye सह, तुम्ही तुमचे सोलाना वॉलेट लिंक करून आणि USDC जमा करून यू.एस. गव्हर्नमेंट ट्रेझरीमध्ये गुंतवणूक करू शकता."}
        {props.language === 'te' && "MyFyeతో, మీరు మీ సోలానా వాలెట్‌ని లింక్ చేయడం ద్వారా మరియు USDCని డిపాజిట్ చేయడం ద్వారా U.S. ప్రభుత్వ ట్రెజరీలలో పెట్టుబడి పెట్టవచ్చు."}
        {props.language === 'ta' && "MyFye மூலம், உங்கள் சோலானா வாலட்டை இணைத்து USDC டெபாசிட் செய்வதன் மூலம் அமெரிக்க அரசாங்க கருவூலங்களில் முதலீடு செய்யலாம்."}
        {props.language === 'vi' && "Với MyFye, bạn có thể đầu tư vào kho bạc của chính phủ Hoa Kỳ bằng cách Liên kết ví Solana của bạn và gửi USDC."}
        {props.language === 'sw' && "Ukiwa na MyFye, unaweza kuwekeza katika hazina za serikali ya Marekani kwa Kuunganisha mkoba wako wa Solana na kuweka USDC."}
    
    </div>
</>

  );
}