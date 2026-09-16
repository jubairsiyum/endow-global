export type BlogPost = {
  id: string
  title: string
  slug: string
  description: string
  content: string
  coverImage: string
  category: string
  tags: string[]
  author: string
  publishedAt: string | null
  viewCount: number
  featured: boolean
  section: string | null
}

export const STUDENT_LIFE_ARTICLES: Record<string, BlogPost> = {
  'dormitory-life': {
    id: 'student-life-dormitory-life',
    title: 'The Practical Guide to University Dorms and Housing in Korea',
    slug: 'dormitory-life',
    description:
      'What living in a Korean university dormitory actually looks like, from the mandatory TB chest X-ray and midnight curfews to ondol floor heating wars and the reality of roommate roulette.',
    coverImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&h=600&fit=crop',
    category: 'Student Life',
    tags: ['Korea', 'Dormitory', 'Student Housing', 'Campus Life', 'Seoul'],
    author: 'Min-jun Kim',
    publishedAt: '2026-08-20T09:00:00.000Z',
    viewCount: 3840,
    featured: false,
    section: 'student_life',
    content: `
      <p>
        The email granting your university admission arrives with immense relief. Three weeks later, the housing coordinator sends a secondary document with strict deadlines and a medical checklist that catches half of incoming international students off guard. Dormitory living in South Korea is organized, remarkably safe, and relatively cheap compared to private rentals. It also operates under a rigid set of administrative rules that do not bend for jet lag or lost paperwork.
      </p>

      <h2>The Mandatory Tuberculosis Screening</h2>
      <p>
        Before you are allowed to collect your plastic room key card, you must hand over a physical medical certificate confirming a clear chest X-ray for tuberculosis. This test must be conducted within thirty days of your official check-in date. If you arrive at the dormitory security desk with an expired certificate, or worse, no paper at all, the staff will politely refuse you entry.
      </p>
      <p>
        This happens every single semester. Students step off a twelve-hour flight at Incheon Airport, haul two twenty-three kilogram suitcases up the steep hills of Sinchon or Anam, only to be turned away at the dormitory lobby. If that happens on a Saturday afternoon, you are stuck booking a motel room for ₩65,000 a night until Monday morning. On Monday, you must navigate to the nearest district public health center, known locally as a bogeonso (보건소). A chest X-ray at a bogeonso costs roughly ₩12,000 and takes two to three business days to issue results, whereas a private international clinic in Gangnam can issue same-day papers for ₩80,000. Get your X-ray done in your home country during your final pre-departure week, make sure the doctor signs an English certificate, and keep the hard copy in your carry-on backpack.
      </p>

      <blockquote>
        If you forget your tuberculosis test paper at home, you will quickly learn the Korean word for public health center while sleeping on an unfamiliar motel mattress.
      </blockquote>

      <h2>Real Costs: Dorms vs. Gosiwon vs. One-Room Villas</h2>
      <p>
        Campus housing is almost always the most economical choice for your first academic year. A standard double occupancy room (two roommates sharing one bedroom and an attached bathroom) costs between ₩1,300,000 and ₩1,850,000 for a sixteen-week semester. That breaks down to roughly ₩325,000 to ₩460,000 per month, with high-speed internet, water, and heating included in the total.
      </p>
      <p>
        Single rooms inside university dormitories do exist, but they are scarce. Most schools reserve them for graduate researchers, resident assistants, or students with documented medical conditions. When available, a single room runs between ₩2,200,000 and ₩2,900,000 per semester.
      </p>
      <p>
        If you miss the dormitory application window, your off-campus options split into two categories:
      </p>
      <ul>
        <li><strong>Gosiwon (고시원):</strong> Tiny private micro-rooms measuring four to six square meters. Monthly rent is ₩350,000 to ₩520,000 with zero deposit. Rice, instant ramen, and kimchi are usually free in the shared communal kitchen, but the sound insulation is paper-thin and the living space feels like a walk-in closet.</li>
        <li><strong>One-Room Villa (원룸):</strong> A self-contained studio flat near campus. Rent is typically ₩550,000 to ₩800,000 per month, plus ₩80,000 in monthly maintenance fees (gwallibi). The major barrier is the key money deposit (bojeunggeum, 보증금). Landlords demand a lump-sum cash deposit between ₩5,000,000 and ₩10,000,000 upfront before handing over the keypad code.</li>
      </ul>

      <h2>Curfews and the Demerit Point System</h2>
      <p>
        Most university dorms in Korea maintain an active curfew, known as tonggeum (통금). Between midnight and 5:00 AM (or 1:00 AM on weekends), the exterior security turnstiles lock down completely. Tapping your student card during curfew hours registers a digital penalty on your student portal.
      </p>
      <p>
        Discipline is managed through a demerit point system (beoljeom, 벌점). Accumulating ten to twelve points within a single semester leads to immediate expulsion from the building without a tuition refund:
      </p>
      <ul>
        <li><strong>Late return during curfew:</strong> 1 to 2 penalty points per occurrence.</li>
        <li><strong>Failed room cleanliness inspection:</strong> 2 penalty points.</li>
        <li><strong>Prohibited cooking appliances (electric kettles, hot plates, rice cookers):</strong> 4 penalty points.</li>
        <li><strong>Alcohol possession inside rooms:</strong> 5 penalty points.</li>
        <li><strong>Smuggling an unauthorized guest into your room overnight:</strong> 10 penalty points and immediate eviction.</li>
      </ul>
      <p>
        If you plan to stay out past midnight studying at a 24-hour cafe or socializing with friends in Hongdae, you have two sensible choices: return before 11:55 PM, or stay out safely until the first subway runs at 5:30 AM. Do not attempt to climb the ground-floor fences. The perimeter security cameras are monitored closely by building supervisors.
      </p>

      <h2>Ondol Heating and Roommate Dynamics</h2>
      <p>
        Korean dormitories utilize ondol (온돌), radiant underfloor heating. Pipes embedded beneath the flooring pump hot water to warm the room from the ground upward. During Seoul winters, when outdoor temperatures plunge to minus fifteen Celsius, ondol keeps your room wonderfully cozy.
      </p>
      <p>
        The friction starts with the thermostat dial. In many dorms, heating controls are located on a small wall panel printed entirely in Korean characters: nanbang (난방, heating), onsu (온수, hot water), and oechul (외출, away mode). If your roommate prefers sleeping in twenty-six-degree tropical heat while you need eighteen degrees to breathe, you will find yourself in silent thermostat skirmishes by mid-November. Talk to your roommate during the first week. Establish a shared policy on sleeping temperatures, phone calls after 11:00 PM, and whether shoes are left strictly at the entryway threshold (hyeongwan).
      </p>
      <p>
        Laundry rooms are situated in the basement. Washing machines and dryers operate on prepaid laundry smart cards or ₩1,000 cash notes. Bring a folding laundry hamper and a compact drying rack from Daiso, because commercial dryers in communal facilities often leave heavy cotton sweaters damp after forty-five minutes of tumbling.
      </p>
      <p>
        Campus housing strips away the burden of utility contracts and real estate agents. It requires giving up a portion of your independence in exchange for affordability and proximity to your morning 9:00 AM lecture hall. When your socks are drying on the rack beside your desk and the curfew chimes ring across the quiet quad at midnight, you realize the routine has quietly become your normal life.
      </p>
    `,
  },

  'food-culture': {
    id: 'student-life-food-culture',
    title: 'Eating Well as an International Student in Korea (Without Going Broke)',
    slug: 'food-culture',
    description:
      'A realistic breakdown of campus cafeterias, the midnight convenience store circuit, navigating solo dining hurdles, and avoiding hidden pork broth.',
    coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=600&fit=crop',
    category: 'Student Life',
    tags: ['Korea', 'Korean Food', 'Campus Cafeteria', 'Student Budget', 'Seoul Dining'],
    author: 'Ji-won Park',
    publishedAt: '2026-08-22T10:30:00.000Z',
    viewCount: 4210,
    featured: false,
    section: 'student_life',
    content: `
      <p>
        The smell of toasted sesame oil and simmering radish broth hits you before you even push open the heavy double doors of the student union basement. For anyone arriving in Korea on a modest student stipend, food is both the greatest everyday pleasure and an immediate logistical puzzle. You quickly discover that dining well has little to do with expensive restaurants and everything to do with understanding how campus cafeterias, local alley joints, and convenience stores function.
      </p>

      <h2>The Campus Cafeteria (Haksik)</h2>
      <p>
        Every university campus operates at least two or three student cafeterias, universally referred to as haksik (학식). These are not corporate food courts with inflated prices. They are subsidized dining halls designed to feed undergraduates nutritious, filling meals for ₩4,500 to ₩6,500 per tray.
      </p>
      <p>
        The ordering process is straightforward once you do it once:
      </p>
      <ol>
        <li>Approach the automated kiosk machine by the entrance doors. Most kiosks offer an English interface toggle in the top-right corner.</li>
        <li>Select your set: Menu A is usually a hearty Korean stew or stir-fry (such as jeyuk bokkeum spicy pork or kimchi jjigae), while Menu B is often a Western or fusion option like pork cutlet (donkkaseu) or omurice.</li>
        <li>Pay with your local bank card or T-money card. The kiosk prints a small paper slip with your meal number.</li>
        <li>Walk up to the metal serving counter, grab a stainless steel tray, and collect your dishes.</li>
      </ol>
      <p>
        The food tray features stamped compartments: a mound of sticky short-grain white or purple rice, a piping hot bowl of soup, the main protein, and side dishes (banchan). Side dishes like fresh baechu kimchi, yellow pickled radish (danmuji), and seasoned soybean sprouts (kongnamul) are self-serve and unlimited at the central refill carts. When you finish eating, carry your tray to the conveyor belt disposal station, scrape food remnants into the designated bin, and place your chopsticks into the sanitizing tray.
      </p>

      <blockquote>
        In your first month, you will tear at least three triangular kimbap sheets in half before mastering the exact three-stage pull sequence on the plastic wrapper.
      </blockquote>

      <h2>The Convenience Store Survival Kit</h2>
      <p>
        Korean convenience stores (pyeon-uijeom, 편의점), primarily GS25, CU, and 7-Eleven, are community living rooms. During midterm exam weeks, they are filled with students hunched over laptop screens at 2:00 AM, surrounded by microwave steam and instant noodle cups.
      </p>
      <p>
        The undisputed king of budget sustenance is samgak-kimbap (삼각김밥), the triangular rice ball wrapped in roasted seaweed. Priced between ₩1,200 and ₩1,600, two of these plus a carton of banana milk make a full breakfast for under ₩4,500. The tuna mayonnaise (chamchi mayo) and spicy Jeonju bibimbap varieties are the most reliable choices. Opening them requires technique: pull strip number one down the middle, then gently slide corners two and three outward. Pulling the plastic too aggressively shreds the crisp seaweed into soggy flakes.
      </p>
      <p>
        For hot lunches, pre-packaged bento boxes (dosirak) cost between ₩4,800 and ₩5,800. They include rice, rolled omelet, bulgogi, and fried dumplings. The store clerk will point to the row of industrial microwaves along the window counter. Press the two-minute button, grab a set of wooden chopsticks from the rack, and eat right at the window counter overlooking the street.
      </p>

      <h2>The Solo Dining Wall: Honbap Culture</h2>
      <p>
        Korea has made great strides with honbap (혼밥, eating alone), especially around university districts like Sinchon, Hyehwa, and Anam. Fast-casual noodle counters and Japanese curry shops often feature single-person booths equipped with private phone charging plugs.
      </p>
      <p>
        However, traditional communal restaurants remain resistant to solo diners. If you walk into an authentic Korean barbecue house (samgyeopsal) or a spicy chicken stir-fry spot (dakgalbi) by yourself at 7:00 PM on a Friday, the server will frequently raise two fingers and apologize, stating there is a mandatory two-portion minimum (2-inbun, 2인분). You can still dine there if you are willing to pay for two full adult portions, but sitting alone with two sizzling iron skillets in a bustling dining room can feel awkward. For solo evenings, stick to neighborhood baekban (백반) restaurants, where grandmother cooks serve a rotating home-cooked meal with seven side dishes for ₩8,000.
      </p>

      <h2>Dietary Restrictions: The Hidden Broth Problem</h2>
      <p>
        Navigating dietary restrictions in Korea requires vigilance. Meat broth, particularly pork (dwaeji yuksu) and anchovy (myeolchi yuksu), is the foundational base of almost all stews, sauces, and noodle soups.
      </p>
      <p>
        If you are vegetarian, vegan, or eat strictly Halal:
      </p>
      <ul>
        <li>Kimchi is almost never strictly vegetarian. Traditional fermentation relies on salted shrimp (saeujeot) or fermented anchovy fish sauce (myeolchi aekjeot).</li>
        <li>Tofu stew (sundubu jjigae) often contains ground pork or tiny clams hidden beneath the red chili oil even when the menu lists it simply as soft tofu stew.</li>
        <li>Learn the crucial phrase: <em>"Gogi ppaego mandureo jusil su innayo?"</em> (Can you make this without meat?) and look for ingredients labeled <em>"dwaejigogi ham-yu"</em> (돼지고기 함유, contains pork) on packaged snacks.</li>
      </ul>
      <p>
        Keep a stock of your favorite staple spices and sauces from home. Itaewon in Seoul and the areas surrounding major universities host foreign grocery markets where you can find Halal poultry, lentils, and familiar comfort foods.
      </p>
      <p>
        Late in the semester, when project deadlines pile up and the autumn air turns crisp, you will sit on a plastic stool outside a street tent near the subway exit. As the vendor scoops steaming fishcake broth into a paper cup and hands you a skewer of tteokbokki for ₩3,500, the language barrier recedes. You eat, you listen to the chatter around you, and the city feels surprisingly welcoming.
      </p>
    `,
  },

  'transportation': {
    id: 'student-life-transportation',
    title: 'The No-Nonsense Guide to Navigating Korean Transit on a Student Budget',
    slug: 'transportation',
    description:
      'How the transit transfer discount system works, why Google Maps fails in Korea, which transport cards to buy, and the survival rules of Seoul city buses.',
    coverImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=600&fit=crop',
    category: 'Student Life',
    tags: ['Transportation', 'T-Money', 'Seoul Subway', 'Student Budget', 'Korea Travel'],
    author: 'Sung-hoon Choi',
    publishedAt: '2026-08-25T14:15:00.000Z',
    viewCount: 3950,
    featured: false,
    section: 'student_life',
    content: `
      <p>
        Seoul and the surrounding Gyeonggi province boast one of the cleanest, most punctual public transit networks on earth. Trains arrive to the exact second, heated seats warm your commute in January, and high-speed Wi-Fi functions deep underground. Despite the engineering efficiency, the system operates on specific fare calculation rules that can drain your bank balance if you misunderstand how transfers and card readers work.
      </p>

      <h2>The Transit Card Dilemma: T-Money vs. Climate Card</h2>
      <p>
        Your first purchase upon leaving the airport arrival hall must be a rechargeable transit card. Do not purchase single-journey paper tickets at subway kiosks; they cost an extra ₩100 per ride and require depositing a refundable ₩500 coin that you must queue to reclaim at your destination.
      </p>
      <p>
        You have two practical choices for daily transit:
      </p>
      <ul>
        <li><strong>Standard T-Money Card:</strong> Costs ₩3,000 to ₩4,000 for the empty card at any convenience store counter. You load cash onto the card at station top-up machines or convenience store cash registers. The base fare for the subway is ₩1,400 per trip, while blue and green city buses charge ₩1,500. It works everywhere in South Korea, including Busan, Daegu, and Jeju Island, as well as in taxis.</li>
        <li><strong>Seoul Climate Card (Gihoo Donghaeng Card):</strong> Launched by the Seoul Metropolitan Government, this card offers unlimited subway and bus rides within Seoul city borders for ₩62,000 per month (₩65,000 if you want access to the city's shared public bicycles, Ttareungyi). International students aged nineteen to thirty-nine qualify for the Youth Discount, which reduces the monthly recharge fee to ₩55,000.</li>
      </ul>
      <p>
        Note this critical limitation: station ticket recharge kiosks accept only physical Korean cash banknotes. Foreign Visa, Mastercard, and digital Apple Pay setups will not work at ticket vending machines. Always carry two or three crisp ₩10,000 bills in your wallet specifically for subway recharges.
      </p>

      <blockquote>
        Tap your card when you board, and never forget to tap when you step off, because the reader will quietly charge a penalty fare the moment you board your next bus.
      </blockquote>

      <h2>The Transfer Discount System (Hwanseung)</h2>
      <p>
        The integrated transit system allows you to transfer between subways and buses, or between different bus lines, without paying a second base fare. You can link up to four consecutive transfers within a thirty-minute window (extended to sixty minutes between 9:00 PM and 7:00 AM).
      </p>
      <p>
        Under this system, the fare is calculated by the total travel distance rather than per vehicle boarding. You pay the base fare for the first ten kilometers, after which a modest distance surcharge of ₩100 is added for every additional five kilometers.
      </p>
      <p>
        The trap for newcomers is the exit tag (hacha tag, 하차 태그). When riding a bus, you must tap your card against the sensor beside the exit doors as you step off. If you rush off without tapping, the transit computer assumes you rode the route to the very end of the line. Not only do you lose your transfer discount on your next connection, but your card is hit with a double base fare penalty on your next boarding.
      </p>

      <h2>Why Google Maps Will Fail You in Korea</h2>
      <p>
        Due to strict national security laws concerning geographic mapping data, South Korea restricts foreign corporations from exporting detailed local cartographic servers abroad. As a result, Google Maps is essentially crippled in Korea. It cannot render accurate walking directions, does not calculate live bus movements, and frequently lists outdated commercial routes.
      </p>
      <p>
        Download one of two domestic apps immediately:
      </p>
      <ul>
        <li><strong>Naver Map (네이버 지도):</strong> Offers an intuitive English language setting, highly accurate pedestrian walking navigation, building interior layouts, and live second-by-second bus arrival counts.</li>
        <li><strong>KakaoMap (카카오맵):</strong> Equally reliable, with excellent 3D station maps and precise indications of which subway car door (such as Car 3-2) provides the quickest walking transfer at major interchange hubs like Sindorim or Wangsimni.</li>
      </ul>

      <h2>Seoul City Bus Etiquette and Late-Night Travel</h2>
      <p>
        Boarding a Seoul green or blue bus is not a leisurely process. Drivers keep strict schedules and will not wait for you to find an empty seat. Step through the front doors, tap your card against the reader, and grab an overhead strap or handrail immediately before the vehicle accelerates. Takeaway coffee cups with open lids or straw lids are banned on city buses; drivers will firmly refuse boarding until you discard the beverage into a curbside bin.
      </p>
      <p>
        Normal subway operations shut down between 11:45 PM and 12:30 AM depending on the terminal branch. If you find yourself stranded after midnight, look for the designated late-night buses, recognizable by the letter 'N' preceding the route number (such as the N15, N26, or N62). These run every twenty-five to thirty-five minutes along primary nightlife and commuter arteries, charging a night fare of ₩2,150.
      </p>
      <p>
        For weekend getaways beyond the capital, the KTX bullet train connects Seoul Station to Busan in two hours and fifteen minutes for ₩59,800. If your budget is tighter, the older Mugunghwa train covers the same distance in five hours for ₩28,600, while intercity express buses depart every fifteen minutes from the Seoul Express Bus Terminal in Gangnam for roughly ₩25,000 to ₩36,000.
      </p>
      <p>
        Once you understand the transfer rhythm, the entire peninsula opens up to you. Standing on the subway platform at dusk, listening to the classical chime announce an incoming Line 2 train, the sprawling transit grid feels less like a maze and more like a dependable companion.
      </p>
    `,
  },

  'part-time-jobs': {
    id: 'student-life-part-time-jobs',
    title: 'Working on a D-2 Student Visa: Legal Permits, Hourly Wages, and Realistic Jobs',
    slug: 'part-time-jobs',
    description:
      'The complete legal process for securing off-campus work authorization in Korea, 2026 minimum wage figures, allowed working hours, and real workplace pitfalls.',
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
    category: 'Student Life',
    tags: ['Part-Time Jobs', 'D-2 Visa', 'Student Employment', 'Minimum Wage', 'Korea Regulations'],
    author: 'Soo-jin Han',
    publishedAt: '2026-08-28T11:00:00.000Z',
    viewCount: 4560,
    featured: false,
    section: 'student_life',
    content: `
      <p>
        The desire to earn extra spending cash while studying in Korea is natural. Living expenses in Seoul add up quickly, and a part-time job helps offset rent, food, and weekend travel. However, working as an international student is strictly regulated by the Ministry of Justice and Korean Immigration Services. Taking a casual job without formal government authorization is one of the quickest ways to have your visa terminated and face deportation.
      </p>

      <h2>The Legal Gateway: Part-Time Work Permit</h2>
      <p>
        Under a standard D-2 degree student visa, you cannot simply sign an informal contract and begin your shift on Monday. You must obtain an official Part-time Work Permit, formally known as Siganje Chwieop Hwag-inseo (시간제취업 확인서). If you are in Korea on a D-4 language training visa, you are prohibited from working anywhere during your first six consecutive months of study.
      </p>
      <p>
        The mandatory application process involves three sequential steps:
      </p>
      <ol>
        <li><strong>Secure a job offer:</strong> Your prospective employer must complete and sign their portion of the official immigration work form, providing a copy of their business registration certificate (sa-eopja deungrokjeung) and standard employment contract.</li>
        <li><strong>Obtain university endorsement:</strong> Take the employer-signed form to your campus Office of International Affairs (OIA). The university coordinator checks your academic standing. You must have completed at least one semester, hold an attendance record above 70%, and maintain a cumulative GPA of at least 2.0 or 2.5 out of 4.5. If your grades dip below the threshold, the university will decline to stamp the permit.</li>
        <li><strong>Immigration clearance:</strong> Submit the endorsed documentation, along with your official transcript and TOPIK language test score, to the local immigration office via the HiKorea electronic web portal (hikorea.go.kr).</li>
      </ol>
      <p>
        You are legally permitted to commence work only after immigration approves the filing and stamps your passport or digital certificate. Working even a single shift before that stamped authorization is an administrative violation under Article 18 of the Immigration Control Act. Penalties include heavy fines starting at ₩2,000,000, mandatory visa cancellation, and immediate deportation with a multi-year entry prohibition.
      </p>

      <blockquote>
        No hourly wage is worth losing the student visa you spent six months and thousands of dollars to secure.
      </blockquote>

      <h2>Allowed Working Hours and TOPIK Requirements</h2>
      <p>
        Immigration strictly caps weekly working hours based on your demonstrated Korean language proficiency through the official Test of Proficiency in Korean (TOPIK):
      </p>
      <ul>
        <li><strong>Undergraduate students with TOPIK Level 3 or above (Level 4 for 3rd and 4th year students):</strong> Permitted to work up to 20 to 25 hours per week during regular semester class weeks.</li>
        <li><strong>Students without the required TOPIK credential:</strong> Restricted to a maximum of 10 to 15 hours per week, severely limiting your earning potential.</li>
        <li><strong>Official summer and winter vacations:</strong> Weekly hourly limitations are lifted entirely during school breaks, allowing full-time employment provided the work location is properly reported to immigration.</li>
      </ul>

      <h2>2026 Minimum Wage and Pay Realities</h2>
      <p>
        The statutory minimum wage in South Korea for 2026 is ₩10,030 per hour, marking the first time the national baseline has exceeded the ₩10,000 milestone. All registered businesses, regardless of size or employee nationality, are legally mandated to pay at least this rate.
      </p>
      <p>
        Under Korean labor standards, if an employee works fifteen or more hours per week on a consistent schedule, the employer is legally obligated to pay an additional weekly holiday allowance (juhyu sudang, 주휴수당). In practice, many small cafe owners and convenience store franchisees intentionally cap student schedules at fourteen hours per week specifically to avoid paying this holiday allowance.
      </p>

      <h2>Where International Students Actually Find Work</h2>
      <p>
        Job options depend heavily on your conversational fluency in Korean:
      </p>
      <ul>
        <li><strong>On-Campus Employment:</strong> Positions in the university library, international admissions office, computer lab, or campus bookstore. These pay standard minimum wage (₩10,030 to ₩10,500 per hour), offer flexible shifts around your lecture timetable, and simplify the immigration paperwork. Competition for these roles is intense, so inquire at your department office during the first week of class.</li>
        <li><strong>Convenience Stores and Cafes:</strong> Routine cashier and barista roles in student neighborhoods like Sinchon, Hongdae, or Anam. You need at least TOPIK Level 3 conversational fluency to pass the initial interview, handle customer card transactions, and manage inventory deliveries.</li>
        <li><strong>Restaurant Front-of-House (Hall Seobing):</strong> Serving tables, taking orders, and clearing dishes at neighborhood barbecue or stew restaurants. Shifts can be physically demanding, but staff meals are almost always provided free of charge at the end of the shift.</li>
        <li><strong>Prohibited Sectors:</strong> Private language tutoring in residential apartments is illegal on a D-2 visa. Similarly, employment in manufacturing plants, construction sites, and nightlife entertainment establishments (bars, hostess clubs, and adult entertainment venues) is strictly prohibited. Engaging in unauthorized tutoring or bar employment triggers immediate deportation upon discovery.</li>
      </ul>

      <h2>The Cash-Under-the-Table Trap</h2>
      <p>
        During your job hunt on apps like Albamon (알바몬) or Danggeun Market (당근마켓), you will inevitably encounter managers who say: "Let us skip the immigration paperwork and I will pay you in cash."
      </p>
      <p>
        Walk away from these offers immediately. Employers offering undocumented cash wages do so to avoid labor taxes and circumvent wage regulations. If that employer subsequently withholds your monthly pay or forces you to work uncompensated overtime, you have zero legal recourse. Reporting the stolen wages to the Ministry of Employment and Labor exposes your own unauthorized employment to immigration investigators.
      </p>
      <p>
        Protect yourself by insisting on a formal written contract, verifying your immigration stamp, and receiving all monthly salary deposits directly into your domestic Korean bank account. When your paycheck lands cleanly at the end of the month, matching your timesheet and backed by legal status, the peace of mind far outweighs any shortcut.
      </p>
    `,
  },
}

export const STUDENT_LIFE_ARTICLE_LIST = Object.values(STUDENT_LIFE_ARTICLES)
