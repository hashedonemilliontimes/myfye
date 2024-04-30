import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { setLanguage } from '../../helpers/languageManager';
import GlobeMenu from '../globeMenu';

import { LanguageCodeProps } from '../../helpers/languageManager';

export default function AboutPageText(props: LanguageCodeProps) {


  const params = useParams();

  return (
    <div style={{marginTop: '45px',     color: '#333333'}}>
        <h1 style={{ fontSize: window.innerWidth < 768 ? '34px' : '60px', width: window.innerWidth < 768 ? '320px' : '550px' }}>
        {props.language === 'en' && "Control the safest investments in the world with crypto"}
        {props.language === 'da' && "Eksponering for de sikreste investeringer i verden med krypto"}
        {props.language === 'de' && "Zugang zu den sichersten Investitionen der Welt mit Krypto"}
        {props.language === 'es' && "Exposición a las inversiones más seguras del mundo con cripto"}
        {props.language === 'it' && "Esposizione agli investimenti più sicuri al mondo con le criptovalute"}
        {props.language === 'pt' && "Exposição aos investimentos mais seguros do mundo com criptografia"}
        {props.language === 'sk' && "Vystavenie sa najbezpečnejším investíciám na svete s kryptomenami"}
        {props.language === 'ar' && "التعرض للاستثمارات الأكثر أمانًا في العالم باستخدام العملات المشفرة"}
        {props.language === 'tr' && "Kripto ile dünyanın en güvenli yatırımlarına maruz kalma"}
        {props.language === 'fr' && "Exposition aux investissements les plus sûrs au monde avec la crypto"}
        {props.language === 'hi' && "क्रिप्टो के साथ दुनिया में सबसे सुरक्षित निवेश तक पहुंच"}
        {props.language === 'zh' && "通过加密货币进行世界上最安全的投资"}
        {props.language === 'id' && "Paparan investasi teraman di dunia dengan kripto"}
        {props.language === 'ko' && "암호화폐로 세계에서 가장 안전한 투자에 노출"}
        {props.language === 'ja' && "暗号通貨を使った世界で最も安全な投資へのエクスポージャー"}
        {props.language === 'ru' && "Доступ к самым безопасным инвестициям в мире с помощью криптовалюты"}
        {props.language === 'ur' && "کریپٹو کے ساتھ دنیا میں محفوظ ترین سرمایہ کاری کی نمائش"}
        {props.language === 'fl' && "Exposure sa pinakaligtas na pamumuhunan sa mundo gamit ang crypto"}
        {props.language === 'mr' && "क्रिप्टोसह जगातील सर्वात सुरक्षित गुंतवणूकीचे प्रदर्शन"}
        {props.language === 'te' && "క్రిప్టోతో ప్రపంచంలోని సురక్షితమైన పెట్టుబడులకు బహిర్గతం"}
        {props.language === 'ta' && "கிரிப்டோ மூலம் உலகின் பாதுகாப்பான முதலீடுகளுக்கு வெளிப்பாடு"}
        {props.language === 'vi' && "Tiếp cận các khoản đầu tư an toàn nhất trên thế giới với tiền điện tử"}
        {props.language === 'sw' && "Mfiduo wa uwekezaji salama zaidi ulimwenguni kwa kutumia crypto"}
        </h1>

        <div style={{
    fontSize: '22px',
    width: window.innerWidth < 768 ? '320px' : '550px',
    color: '#333333'
}}>
        {props.language === 'en' && "MyFye takes the stable coin that you deposit and invests it in U.S. government bonds. This allows anyone to earn a return from anywhere in the world."}
        {props.language === 'da' && "Ependysi tager den USDC, du indsætter, og investerer den i amerikanske statsobligationer. Dette giver alle med USDC mulighed for at tjene et stabilt afkast fra hvor som helst i verden."}
        {props.language === 'de' && "Ependysi nimmt den von Ihnen eingezahlten USDC und investiert ihn in US-Staatsanleihen. Dadurch kann jeder mit USDC von überall auf der Welt eine stabile Rendite erzielen."}
        {props.language === 'es' && "Ependysi toma el USDC que usted deposita y lo invierte en bonos del gobierno estadounidense. Esto permite que cualquier persona con USDC obtenga un rendimiento estable desde cualquier parte del mundo."}
        {props.language === 'it' && "Ependysi prende l'USDC che depositi e lo investe in titoli di stato statunitensi. Ciò consente a chiunque abbia USDC di guadagnare un rendimento stabile da qualsiasi parte del mondo."}
        {props.language === 'pt' && "Ependysi pega o USDC que você deposita e investe em títulos do governo dos EUA. Isso permite que qualquer pessoa com USDC obtenha um retorno estável em qualquer lugar do mundo."}
        {props.language === 'sk' && "Ependysi vezme USDC, ktorý vložíte, a investuje ho do vládnych dlhopisov USA. To umožňuje komukoľvek s USDC získať stabilný výnos odkiaľkoľvek na svete."}
        {props.language === 'ar' && "تأخذ Ependysi عملة USDC التي تودعها وتستثمرها في السندات الحكومية الأمريكية. وهذا يسمح لأي شخص لديه USDC بالحصول على عائد ثابت من أي مكان في العالم."}
        {props.language === 'tr' && "Ependysi yatırdığınız USDC'yi alır ve bunu ABD devlet tahvillerine yatırır. Bu, USDC'si olan herkesin dünyanın herhangi bir yerinden istikrarlı bir getiri elde etmesine olanak tanır."}
        {props.language === 'fr' && "Ependysi prend l'USDC que vous déposez et l'investit dans des obligations du gouvernement américain. Cela permet à toute personne possédant l'USDC d'obtenir un rendement stable depuis n'importe où dans le monde."}
        {props.language === 'hi' && "एपेंडिसी आपके द्वारा जमा किए गए यूएसडीसी को लेता है और इसे अमेरिकी सरकारी बांड में निवेश करता है। यह यूएसडीसी वाले किसी भी व्यक्ति को दुनिया में कहीं से भी स्थिर रिटर्न अर्जित करने की अनुमति देता है।"}
        {props.language === 'zh' && "Ependysi 将您存入的 USDC 投资于美国政府债券。这使得拥有 USDC 的任何人都可以从世界任何地方获得稳定的回报。"}
        {props.language === 'id' && "Ependysi mengambil USDC yang Anda simpan dan menginvestasikannya dalam obligasi pemerintah AS. Ini memungkinkan siapa pun yang memiliki USDC memperoleh pengembalian yang stabil dari mana saja di dunia."}
        {props.language === 'ko' && "Ependysi는 귀하가 예치한 USDC를 가져와 미국 국채에 투자합니다. 이를 통해 USDC를 보유한 사람은 누구나 세계 어디에서나 안정적인 수익을 얻을 수 있습니다."}
        {props.language === 'ja' && "Ependysi は、あなたが預けた USDC を受け取り、それを米国国債に投資します。これにより、USDC を持っている人は誰でも、世界中のどこからでも安定した収益を得ることができます。"}
        {props.language === 'ru' && "Ependysi берет внесенные вами доллары США и инвестирует их в государственные облигации США. это позволяет любому, у кого есть USDC, получать стабильный доход из любой точки мира."}
        {props.language === 'ur' && "Ependysi وہ USDC لیتا ہے جسے آپ جمع کرتے ہیں اور اسے امریکی حکومت کے بانڈز میں سرمایہ کاری کرتے ہیں۔ یہ USDC والے کسی بھی شخص کو دنیا میں کہیں سے بھی مستحکم واپسی حاصل کرنے کی اجازت دیتا ہے۔"}
        {props.language === 'fl' && "Kinukuha ni Ependysi ang USDC na idineposito mo at ini-invest ito sa mga bono ng gobyerno ng U.S. Binibigyang-daan nito ang sinumang may USDC na kumita ng matatag na kita mula saanman sa mundo."}
        {props.language === 'mr' && "Ependysi तुम्ही जमा केलेले USDC घेते आणि ते यू.एस. सरकारी बाँडमध्ये गुंतवते. हे USDC असलेल्या कोणालाही जगातील कोठूनही स्थिर परतावा मिळविण्यास अनुमती देते."}
        {props.language === 'te' && "Ependysi మీరు డిపాజిట్ చేసిన USDCని తీసుకుని, U.S. ప్రభుత్వ బాండ్లలో పెట్టుబడి పెడుతుంది. ఇది USDC ఉన్న ఎవరైనా ప్రపంచంలో ఎక్కడి నుండైనా స్థిరమైన రాబడిని సంపాదించడానికి అనుమతిస్తుంది."}
        {props.language === 'ta' && "Ependysi நீங்கள் டெபாசிட் செய்யும் USDCஐ எடுத்து அமெரிக்க அரசாங்கப் பத்திரங்களில் முதலீடு செய்கிறார். இது USDC உள்ள எவரும் உலகில் எங்கிருந்தும் நிலையான வருமானத்தைப் பெற அனுமதிக்கிறது."}
        {props.language === 'vi' && "Ependysi lấy USDC mà bạn gửi và đầu tư vào trái phiếu chính phủ Hoa Kỳ. điều này cho phép bất kỳ ai có USDC kiếm được lợi nhuận ổn định từ mọi nơi trên thế giới."}
        {props.language === 'sw' && "Ependysi huchukua USDC unayoweka na kuiwekeza katika hati fungani za serikali ya Marekani. Hii inaruhusu mtu yeyote aliye na USDC kupata faida dhabiti kutoka mahali popote ulimwenguni."}
            </div>

            <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px', // Adjust padding as needed
        }}>
            </div>
    </div>
  );
}
