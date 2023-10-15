import React from 'react';
import { LanguageCodeProps } from '../../helpers/languageManager';

export default function HomePageTitle(props: LanguageCodeProps) {
    const isSmallScreen = window.innerWidth <= 768;

    return (
        <>
            <style>
            {`
                    @keyframes springIn {
                        0% {
                            opacity: 0.3;
                            transform: scale(1.2) translateY(50px);
                            borderRadius: 40px;      
                        }
                        20% {
                          opacity: 1;
                          transform: scale(1.2) translateY(50px);
                      }
                        70% {
                          opacity: 1;
                          transform: scale(1.2) translateY(50px);
                      }
                        100% {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                        }
                    }

                    .spring-animation {
                        animation: springIn 2.5s ease-out forwards;  // Adjusted the total animation duration
                    }
                `}
            </style>
            <div className="spring-animation" style={{ fontWeight: 'bold', fontSize: isSmallScreen ? '35px' : '65px', width: '70%' }}>
            {props.language === 'en' && "Now you can earn a stable return from anywhere"}
        {props.language === 'da' && "Nu kan du opnå et stabilt afkast hvor som helst"}
        {props.language === 'de' && "Jetzt können Sie überall eine stabile Rendite erzielen"}
        {props.language === 'es' && "Ahora puedes obtener un rendimiento estable desde cualquier lugar"}
        {props.language === 'it' && "Ora puoi guadagnare un rendimento stabile ovunque"}
        {props.language === 'pt' && "Agora você pode obter um retorno estável em qualquer lugar"}
        {props.language === 'sk' && "Teraz môžete získať stabilný výnos odkiaľkoľvek"}
        {props.language === 'ar' && "الآن يمكنك الحصول على عائد ثابت من أي مكان"}
        {props.language === 'tr' && "Artık her yerden istikrarlı bir getiri elde edebilirsiniz"}
        {props.language === 'fr' && "Vous pouvez désormais obtenir un rendement stable où que vous soyez"}
        {props.language === 'hi' && "अब आप कहीं से भी स्थिर रिटर्न कमा सकते हैं"}
        {props.language === 'zh' && "现在您可以从任何地方赚取稳定的回报"}
        {props.language === 'id' && "Sekarang Anda bisa mendapatkan keuntungan yang stabil dari mana saja"}
        {props.language === 'ko' && "이제 어디서든 안정적인 수익을 얻을 수 있습니다"}
        {props.language === 'ja' && "どこからでも安定した収益が得られるようになりました"}
        {props.language === 'ru' && "Теперь вы можете получать стабильный доход из любой точки мира"}
        {props.language === 'ur' && "اب آپ کہیں سے بھی مستحکم منافع کما سکتے ہیں۔"}
        {props.language === 'fl' && "Ngayon ay maaari kang makakuha ng isang matatag na kita mula sa kahit saan"}
        {props.language === 'mr' && "आता तुम्ही कुठूनही स्थिर परतावा मिळवू शकता"}
        {props.language === 'te' && "ఇప్పుడు మీరు ఎక్కడి నుండైనా స్థిరమైన రాబడిని పొందవచ్చు"}
        {props.language === 'ta' && "இப்போது நீங்கள் எங்கிருந்தும் நிலையான வருமானத்தைப் பெறலாம்"}
        {props.language === 'vi' && "Bây giờ bạn có thể kiếm được lợi nhuận ổn định từ bất cứ đâu"}
        {props.language === 'sw' && "Sasa unaweza kupata mapato thabiti kutoka popote"}
            </div>
        </>
    );
}
