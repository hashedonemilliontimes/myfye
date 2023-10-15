import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { setLanguage } from '../../helpers/languageManager';
import GlobeMenu from '../globeMenu';
import TypingAnimation from './aboutTypingAnimation';
import { LanguageCodeProps } from '../../helpers/languageManager';

export default function AboutPageText2(props: LanguageCodeProps) {


  const params = useParams();

  return (
    <div style={{backgroundColor: '#BBBBBB', paddingTop: '20px', 
    paddingBottom: '20px', color: 'black',}}>
    <div style={{ marginLeft: window.innerWidth < 768 ? '15px' : '60px', 
    marginTop: window.innerWidth < 768 ? '105px' : '65px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

      <div style={{ display: 'flex', flexDirection: 'row', gap: window.innerWidth < 768 ? '30px' : '60px', alignItems: 'center'}}>
        <div style={{ fontSize: window.innerWidth < 768 ? '30px' : '60px', 
          display: 'inline' }}>
        MyFye
        </div>

        <div style={{ fontSize: window.innerWidth < 768 ? '15px' : '26px', 
        fontStyle: 'italic', display: 'inline' }}>
        [ Mī - fī ]
        </div>
        

        <div style={{ fontSize: window.innerWidth < 768 ? '20px' : '26px', 
        fontStyle: 'italic', display: 'inline' }}>
        {props.language === 'en' && "Noun"}
        {props.language === 'da' && "Navneord"}
        {props.language === 'de' && "Substantiv"}
        {props.language === 'es' && "Sustantivo"}
        {props.language === 'it' && "Sostantivo"}
        {props.language === 'pt' && "Substantivo"}
        {props.language === 'sk' && "Podstatné meno"}
        {props.language === 'ar' && "اسم"}
        {props.language === 'tr' && "İsim"}
        {props.language === 'fr' && "Nom"}
        {props.language === 'hi' && "संज्ञा"}
        {props.language === 'zh' && "名词"}
        {props.language === 'id' && "Kata benda"}
        {props.language === 'ko' && "명사"}
        {props.language === 'ja' && "名詞"}
        {props.language === 'ru' && "Существительное"}
        {props.language === 'ur' && "اسم"}
        {props.language === 'fl' && "Pangngalan"}
        {props.language === 'mr' && "संज्ञा"}
        {props.language === 'te' && "నామవాచకం"}
        {props.language === 'ta' && "பெயர்ச்சொல்"}
        {props.language === 'vi' && "Danh từ"}
        {props.language === 'sw' && "Nomino"}
        </div>
        </div>
        <div style={{ flex: 1 }}></div>


    </div>

    <div style={{ marginLeft: window.innerWidth < 768 ? '15px' : '60px', 
        fontSize: window.innerWidth < 768 ? '20px' : '26px', width: window.innerWidth < 768 ? '340px' : '750px', marginBottom: '40px'}}>
        {props.language === 'en' && "This is your finance. Just as our name implies, we endure the test of time, ensuring your funds grow from the moment you deposit them until the day you decide to withdraw. Discover the power of investing in a long term and safe asset with us."}
        {props.language === 'da' && "Det græske ord for investering. En investering er forpligtelsen af ​​midler i en periode, som forventes at bringe yderligere midler til investoren. Teknisk set er en investering en sekvens af nettopengestrømme. For at foretage en investering foretages først en analyse af sikkerheden, efterfulgt af porteføljestyringsteknikker."}
        {props.language === 'de' && "Das griechische Wort für Investition. Eine Investition ist die Bindung von Mitteln für einen bestimmten Zeitraum, die dem Anleger voraussichtlich zusätzliche Mittel einbringen wird. Technisch gesehen ist eine Investition eine Folge von Netto-Cashflows. Um eine Investition zu tätigen, wird zunächst eine Analyse des Wertpapiers durchgeführt, gefolgt von Portfoliomanagementtechniken."}
        {props.language === 'es' && "La palabra griega para inversión. Una inversión es el compromiso de fondos durante un período de tiempo, que se espera que aporte fondos adicionales al inversor. En términos técnicos, una inversión es una secuencia de flujos de efectivo netos. Para realizar una inversión, primero se realiza un análisis del valor, seguido de técnicas de gestión de cartera."}
        {props.language === 'it' && "La parola greca per investimento. Un investimento è l'impegno di fondi per un periodo di tempo, che dovrebbe portare fondi aggiuntivi all'investitore. In termini tecnici, un investimento è una sequenza di flussi di cassa netti. Per effettuare un investimento, viene effettuata prima un'analisi del titolo, seguita da tecniche di gestione del portafoglio."}
        {props.language === 'pt' && "A palavra grega para investimento. Um investimento é o comprometimento de recursos por um período de tempo, que deverá trazer recursos adicionais ao investidor. Em termos técnicos, um investimento é uma sequência de fluxos de caixa líquidos. Para fazer um investimento, primeiro é feita uma análise do título, seguida de técnicas de gestão de portfólio."}
        {props.language === 'sk' && "Grécke slovo pre investíciu. Investícia je viazanie finančných prostriedkov na určité časové obdobie, od ktorého sa očakáva, že investorovi prinesie ďalšie finančné prostriedky. Z technického hľadiska je investícia sled čistých peňažných tokov. Ak chcete investovať, najskôr sa vykoná analýza zabezpečenia, po ktorej nasledujú techniky správy portfólia."}
        {props.language === 'ar' && "كلمة يونانية تعني الاستثمار. الاستثمار هو الالتزام بأموال لفترة من الزمن، والتي من المتوقع أن تجلب أموالاً إضافية للمستثمر. من الناحية الفنية، الاستثمار هو سلسلة من صافي التدفقات النقدية. للقيام بالاستثمار، يتم إجراء تحليل للأمن أولا، تليها تقنيات إدارة المحفظة."}
        {props.language === 'tr' && "yatırım anlamına gelen yunanca kelime. Yatırım, yatırımcıya ek fon getirmesi beklenen fonların belirli bir süre için taahhüt edilmesidir. Teknik açıdan yatırım, net nakit akışlarının bir dizisidir. Yatırım yapmak için öncelikle menkul kıymet analizi yapılır, ardından portföy yönetimi teknikleri uygulanır."}
        {props.language === 'fr' && "Le mot grec pour investissement. Un investissement est l’engagement de fonds pour une période de temps censée apporter des fonds supplémentaires à l’investisseur. En termes techniques, un investissement est une séquence de flux de trésorerie nets. Pour réaliser un investissement, une analyse du titre est effectuée en premier, suivie de techniques de gestion de portefeuille."}
        {props.language === 'hi' && "निवेश के लिए यूनानी शब्द. एक निवेश एक निश्चित अवधि के लिए धन की प्रतिबद्धता है, जिससे निवेशक को अतिरिक्त धन मिलने की उम्मीद होती है। तकनीकी शब्दों में, निवेश शुद्ध नकदी प्रवाह का एक क्रम है। निवेश करने के लिए सबसे पहले सुरक्षा का विश्लेषण किया जाता है, उसके बाद पोर्टफोलियो प्रबंधन तकनीकों का विश्लेषण किया जाता है।"}
        {props.language === 'zh' && "希腊语中的投资一词。投资是一段时间内的资金承诺，预计将为投资者带来额外的资金。用技术术语来说，投资是一系列净现金流量。为了进行投资，首先要对证券进行分析，然后进行投资组合管理技术。"}
        {props.language === 'id' && "Kata Yunani untuk investasi. Investasi adalah komitmen dana untuk jangka waktu tertentu yang diharapkan dapat mendatangkan tambahan dana bagi investor. Dalam istilah teknis, investasi adalah rangkaian arus kas bersih. Untuk melakukan investasi, terlebih dahulu dilakukan analisis terhadap sekuritas, kemudian dilanjutkan dengan teknik manajemen portofolio."}
        {props.language === 'ko' && "투자를 뜻하는 그리스어. 투자는 일정 기간 동안 자금을 투입하는 것이며, 이는 투자자에게 추가 자금을 가져올 것으로 예상됩니다. 기술적인 측면에서 투자는 순현금흐름의 연속입니다. 투자를 하려면 먼저 보안 분석을 수행한 다음 포트폴리오 관리 기술을 수행합니다."}
        {props.language === 'ja' && "投資を意味するギリシャ語。投資とは、一定期間の資金のコミットメントであり、投資家に追加の資金がもたらされることが期待されます。専門用語で言えば、投資は一連の純キャッシュフローです。投資を行うには、まず証券の分析が行われ、次にポートフォリオ管理手法が続きます。"}
        {props.language === 'ru' && "Греческое слово, обозначающее инвестиции. Инвестиции – это вложение средств на определенный период времени, которое, как ожидается, принесет инвестору дополнительные средства. С технической точки зрения инвестиции — это последовательность чистых денежных потоков. Чтобы сделать инвестицию, сначала проводится анализ безопасности, а затем методы управления портфелем."}
        {props.language === 'ur' && "سرمایہ کاری کے لیے یونانی لفظ۔ سرمایہ کاری ایک مدت کے لیے فنڈز کا عزم ہے، جس سے سرمایہ کار کے لیے اضافی فنڈز کی توقع کی جاتی ہے۔ تکنیکی اصطلاحات میں، سرمایہ کاری خالص نقد بہاؤ کا ایک سلسلہ ہے۔ سرمایہ کاری کرنے کے لیے، سب سے پہلے سیکورٹی کا تجزیہ کیا جاتا ہے، اس کے بعد پورٹ فولیو مینجمنٹ کی تکنیک۔"}
        {props.language === 'fl' && "Ang salitang Griyego para sa pamumuhunan. Ang pamumuhunan ay ang pangako ng mga pondo para sa isang yugto ng panahon, na inaasahang magdadala ng karagdagang pondo sa mamumuhunan. Sa mga teknikal na termino, ang isang pamumuhunan ay isang pagkakasunud-sunod ng mga net cash flow. Upang makagawa ng isang pamumuhunan, ang pagsusuri ng seguridad ay ginagawa muna, na sinusundan ng mga diskarte sa pamamahala ng portfolio."}
        {props.language === 'mr' && "गुंतवणुकीसाठी ग्रीक शब्द. गुंतवणूक ही ठराविक कालावधीसाठी निधीची वचनबद्धता असते, ज्यामुळे गुंतवणूकदारांना अतिरिक्त निधी मिळणे अपेक्षित असते. तांत्रिक भाषेत, गुंतवणूक म्हणजे निव्वळ रोख प्रवाहाचा क्रम. गुंतवणूक करण्यासाठी, प्रथम सुरक्षिततेचे विश्लेषण केले जाते, त्यानंतर पोर्टफोलिओ व्यवस्थापन तंत्रे."}
        {props.language === 'te' && "పెట్టుబడికి గ్రీకు పదం. పెట్టుబడి అనేది కొంత కాలానికి నిధుల నిబద్ధత, ఇది పెట్టుబడిదారుడికి అదనపు నిధులను తీసుకువస్తుందని భావిస్తున్నారు. సాంకేతిక పరంగా, పెట్టుబడి అనేది నికర నగదు ప్రవాహాల క్రమం. పెట్టుబడి పెట్టడానికి, మొదట భద్రత యొక్క విశ్లేషణ చేయబడుతుంది, తర్వాత పోర్ట్‌ఫోలియో నిర్వహణ పద్ధతులు."}
        {props.language === 'ta' && "முதலீட்டைக் குறிக்கும் கிரேக்க வார்த்தை. முதலீடு என்பது ஒரு குறிப்பிட்ட காலத்திற்கு நிதிகளின் அர்ப்பணிப்பு ஆகும், இது முதலீட்டாளருக்கு கூடுதல் நிதியைக் கொண்டுவரும் என்று எதிர்பார்க்கப்படுகிறது. தொழில்நுட்ப அடிப்படையில், முதலீடு என்பது நிகர பணப்புழக்கங்களின் வரிசையாகும். முதலீடு செய்ய, முதலில் பாதுகாப்பின் பகுப்பாய்வு செய்யப்படுகிறது, அதைத் தொடர்ந்து போர்ட்ஃபோலியோ மேலாண்மை நுட்பங்கள்."}
        {props.language === 'vi' && "Từ tiếng Hy Lạp có nghĩa là đầu tư. Đầu tư là sự cam kết sử dụng vốn trong một khoảng thời gian, dự kiến ​​sẽ mang lại nguồn vốn bổ sung cho nhà đầu tư. Về mặt kỹ thuật, đầu tư là một chuỗi các dòng tiền ròng. Để thực hiện đầu tư, việc phân tích chứng khoán được thực hiện trước tiên, sau đó là các kỹ thuật quản lý danh mục đầu tư."}
        {props.language === 'sw' && "Neno la Kigiriki kwa uwekezaji. Uwekezaji ni ahadi ya fedha kwa muda, ambayo inatarajiwa kuleta fedha za ziada kwa mwekezaji. Kwa maneno ya kiufundi, uwekezaji ni mlolongo wa mtiririko halisi wa pesa. Ili kufanya uwekezaji, uchambuzi wa usalama unafanywa kwanza, ikifuatiwa na mbinu za usimamizi wa kwingineko."}
        </div>




        
    </div>


  );
}
