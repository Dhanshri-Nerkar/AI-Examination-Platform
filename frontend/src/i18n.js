"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      language: "Language",
      english: "English",
      hindi: "Hindi",
      marathi: "Marathi",
      tamil: "Tamil",
      malayalam: "Malayalam",
      kannada: "Kannada",
      telugu: "Telugu",

      dashboard: "Dashboard",
      student_portal: "Student Portal",
      examiner_portal: "Examiner Portal",
      admin_portal: "Admin Portal",

      home: "Home",
      exams: "Exams",
      results: "Results",
      submissions: "Submissions",
      questions: "Questions",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",

      welcome: "Welcome",
      start_exam: "Start Exam",
      view_exam: "View Exam",
      view_result: "View Result",
      check_answers: "Check Answers",
      publish_results: "Publish Results",

      upcoming: "Upcoming",
      active: "Active",
      completed: "Completed",
      in_progress: "In Progress",

      exam_name: "Exam Name",
      subject: "Subject",
      duration: "Duration",
      maximum_marks: "Maximum Marks",
      total_questions: "Total Questions",
      score: "Score",
      correct: "Correct",
      wrong: "Wrong",
      unanswered: "Unanswered",

      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      back: "Back",
      next: "Next",
      previous: "Previous",
      submit: "Submit",
      search: "Search",

      no_exams: "No examinations available.",
      no_submissions: "No students have submitted this exam yet.",
      result_not_published: "Result has not been published yet.",

      camera_required: "Camera access is required to start the examination.",
      fullscreen_required: "Full-screen mode is required during the examination.",
      accept_and_start: "Accept & Start Examination",
      

      landing: {
      ai_powered_platform: "AI Powered Examination Platform",
      smarter_exams: "Smarter Exams.",
      better_results: "Better Results.",
      faster_grading: "Faster Grading.",
      smarter_insights: "Smarter Insights.",
      hero_description:
        "A secure and intelligent examination platform designed for students, examiners, and administrators.",
      get_started: "Get Started",
      login: "Login",
      user_roles: "User Roles",
      ai_powered: "AI Powered",
      available: "Available",

      ai_examination_platform:
        "AI Examination Platform",
      dashboard: "Dashboard",
      exams: "Exams",
      results: "Results",
      settings: "Settings",
      welcome_back: "Welcome back",
      examination_overview:
        "Here's your examination overview",
      examinations: "Examinations",
      completed: "Completed",
      average_score: "Average Score",
      performance: "Performance",
      this_month: "This Month",

      trusted_institutions:
        "Trusted by forward-thinking institutions",
      university: "University",
      academy: "Academy",
      institute: "Institute",
      coaching: "Coaching",
      lab: "Lab",

      platform_features: "PLATFORM FEATURES",
      everything_you_need:
        "Everything you need for",
      modern_examinations:
        "modern examinations",
      features_description:
        "Manage the complete examination process from one centralized platform.",

      student_portal: "Student Portal",
      student_portal_description:
        "Attend examinations, submit answers, and view results in real-time.",

      examiner_portal: "Examiner Portal",
      examiner_portal_description:
        "Create examinations, manage questions, and evaluate performance.",

      admin_control: "Admin Control",
      admin_control_description:
        "Manage users, examiner approvals, and the complete platform.",

      ai_powered_description:
        "Intelligent technology for a modern examination experience.",

      how_it_works: "HOW IT WORKS",
      get_started_in: "Get started in",
      three_simple_steps: "3 simple steps",

      register: "Register",
      register_description:
        "Create your account as a student, examiner, or administrator.",

      attend_or_create: "Attend or Create",
      attend_or_create_description:
        "Students take exams. Examiners create and manage them.",

      get_results: "Get Results",
      get_results_description:
        "Instant feedback, scores, and performance insights.",

      about_platform: "ABOUT PLATFORM",
      built_for_the: "Built for the",
      future_of_education:
        "future of education",

      about_description_one:
        "AI Examination Platform provides a centralized environment for students, examiners, and administrators.",

      about_description_two:
        "From registration and examination management to results and administration, everything is organized in one secure platform.",

      create_account: "Create Account",

      faq: "FAQ",
      frequently_asked: "Frequently asked",
      questions: "questions",

      faq1_q: "Who can use this platform?",
      faq1_a:
        "Students, examiners, and administrators — each with a dedicated role-based dashboard.",

      faq2_q: "Is the platform AI powered?",
      faq2_a:
        "Yes. AI assists in generating questions, evaluating answers, and analyzing performance.",

      faq3_q:
        "Do examiners need admin approval?",
      faq3_a:
        "Yes. Examiners register and wait for admin approval before creating examinations.",

      faq4_q:
        "Can students view results instantly?",
      faq4_a:
        "Results are available as soon as the examiner publishes them from their dashboard.",

      ready_to_get_started:
        "Ready to get started?",

      start_journey_today:
        "Start your examination journey today.",
    },
    nav: {
  features: "Features",
  about: "About",
  login: "Login",
  register: "Register",
},

footer: {
  platform: "AI Examination Platform",
  copyright: "© 2026 AI Examination Platform",
},

login: {
  smart_simple: "Smart & Simple Examination Platform",
  welcome: "Welcome",
  back: "back.",
  description:
    "Sign in to continue your examination journey and access everything you need in one place.",

  safe_secure: "Safe & Secure",
  safe_secure_description:
    "Your account information is kept safe and private.",

  everything_one_place: "Everything in One Place",
  everything_one_place_description:
    "Access your examinations, results and activities easily.",

  easy_to_use: "Easy to Use",
  easy_to_use_description:
    "A simple experience designed for everyone.",

  welcome_back: "Welcome back",
  sign_in_description:
    "Sign in to continue to your account.",

  email: "Email Address",
  password: "Password",
  password_placeholder: "Enter your password",

  remember_me: "Remember me",

  logging_in: "Logging in...",
  sign_in: "Sign In",

  no_account: "Don't have an account?",
  create_account: "Create an account",

  back_home: "Back to home",

  invalid_credentials: "Invalid email or password",
},
register: {
  smart_simple: "Smart & Simple Examination Platform",
  start_your: "Start your",
  examination_journey: "examination journey.",
  description:
    "Create your account and enjoy a simple, secure and convenient examination experience.",

  safe_secure: "Safe & Secure",
  safe_secure_description:
    "Your account and personal information are kept secure.",

  simple_examination: "Simple Examination",
  simple_examination_description:
    "Take your examinations easily from one convenient platform.",

  track_progress: "Track Your Progress",
  track_progress_description:
    "View your results and keep track of your examination performance.",

  create_account: "Create your account",
  join_platform:
    "Join the platform and get started today.",

  full_name: "Full Name",
  full_name_placeholder: "Enter your full name",

  email: "Email Address",

  register_as: "I want to register as",

  student: "Student",
  student_description: "Take examinations",

  examiner: "Examiner",
  examiner_description:
    "Create and manage examinations",

  admin_approval: "Administrator approval required",
  admin_approval_description:
    "Your registration request will be reviewed by an administrator before you can access the examiner account.",

  password: "Password",
  password_placeholder: "Create a password",
  password_hint: "Use at least 6 characters.",

  confirm_password: "Confirm Password",
  confirm_password_placeholder:
    "Enter your password again",

  creating_account: "Creating your account...",
  submit_request: "Submit Request",
  create_account_button: "Create Account",

  already_account: "Already have an account?",
  sign_in: "Sign in",

  back_home: "Back to home",

  name_required: "Please enter your full name.",
  email_required: "Please enter your email address.",
  password_length:
    "Your password must contain at least 6 characters.",
  password_mismatch:
    "The passwords you entered do not match.",

  create_account_error:
    "We could not create your account. Please try again.",

  connection_error:
    "Unable to create your account. Please check your connection and try again.",

  examiner_success:
    "Your request has been submitted successfully. An administrator will review your request.",

  student_success:
    "Your account has been created successfully! Taking you to the login page...",
},

admin: {
  role: "Administrator",
  logout: "Logout",
  toggle_menu: "Toggle menu",

  nav: {
    dashboard: "Dashboard",
    users: "Users",
    examinations: "Examinations",
    examiner_requests: "Examiner Requests",
  },

  login_required: "Admin login required.",
  stats_error:
    "Failed to load dashboard statistics.",
  examiner_requests_error:
    "Failed to load examiner requests.",

  approve_error:
    "Failed to approve examiner.",
  reject_error:
    "Failed to reject examiner.",

  examiner_approved:
    "Examiner approved successfully.",
  examiner_rejected:
    "Examiner rejected.",

  loading_dashboard:
    "Loading Admin Dashboard...",

  administration: "ADMINISTRATION",
  dashboard_title: "Admin Dashboard",
  dashboard_subtitle:
    "Manage users, examinations and platform activity from one place.",

  refresh: "Refresh",

  total_students: "Total Students",
  total_examiners: "Total Examiners",
  pending_requests: "Pending Requests",
  total_examinations: "Total Examinations",

  management: "MANAGEMENT",
  quick_actions: "Quick Actions",
  quick_actions_description:
    "Access the main administration areas.",

  manage_users: "Manage Users",
  manage_users_description:
    "View students, examiners and administrators.",

  examiner_requests: "Examiner Requests",
  examiner_requests_description:
    "Review pending examiner registrations.",

  examination_management:
    "Examination Management",
  examination_management_description:
    "Monitor examinations, schedules and student activity.",

  platform: "PLATFORM",
  system_overview: "System Overview",

  users: "Users",
  students: "Students",
  examiners: "Examiners",
  approved_examiners: "Approved Examiners",

  examinations: "Examinations",
  total_exams: "Total Exams",
  published: "Published",
  unpublished: "Unpublished",

  examination_activity:
    "Examination Activity",
  total_attempts: "Total Attempts",
  submitted: "Submitted",
  in_progress: "In Progress",

  user_management: "USER MANAGEMENT",
  examiner_registration_requests:
    "Examiner Registration Requests",
  examiner_registration_description:
    "Review and manage examiner registration requests.",

  pending: "Pending",

  loading_examiner_requests:
    "Loading examiner requests...",

  no_pending_requests:
    "No Pending Requests",
  no_pending_requests_description:
    "There are currently no examiner registration requests waiting for review.",

  pending_review: "Pending Review",

  approve: "Approve",
  reject: "Reject",
},
    },
  },

  hi: {
    translation: {
      language: "भाषा",
      english: "अंग्रेज़ी",
      hindi: "हिन्दी",
      marathi: "मराठी",
      tamil: "तमिल",
      malayalam: "मलयालम",
      kannada: "कन्नड़",
      telugu: "तेलुगु",

      dashboard: "डैशबोर्ड",
      student_portal: "छात्र पोर्टल",
      examiner_portal: "परीक्षक पोर्टल",
      admin_portal: "प्रशासक पोर्टल",

      home: "होम",
      exams: "परीक्षाएँ",
      results: "परिणाम",
      submissions: "प्रस्तुतियाँ",
      questions: "प्रश्न",
      profile: "प्रोफ़ाइल",
      settings: "सेटिंग्स",
      logout: "लॉग आउट",

      welcome: "स्वागत है",
      start_exam: "परीक्षा शुरू करें",
      view_exam: "परीक्षा देखें",
      view_result: "परिणाम देखें",
      check_answers: "उत्तर जाँचें",
      publish_results: "परिणाम प्रकाशित करें",

      upcoming: "आगामी",
      active: "सक्रिय",
      completed: "पूर्ण",
      in_progress: "प्रगति में",

      exam_name: "परीक्षा का नाम",
      subject: "विषय",
      duration: "अवधि",
      maximum_marks: "अधिकतम अंक",
      total_questions: "कुल प्रश्न",
      score: "स्कोर",
      correct: "सही",
      wrong: "गलत",
      unanswered: "अनुत्तरित",

      loading: "लोड हो रहा है...",
      save: "सहेजें",
      cancel: "रद्द करें",
      back: "वापस",
      next: "अगला",
      previous: "पिछला",
      submit: "जमा करें",
      search: "खोजें",

      no_exams: "कोई परीक्षा उपलब्ध नहीं है।",
      no_submissions: "अभी तक किसी छात्र ने यह परीक्षा जमा नहीं की है।",
      result_not_published: "परिणाम अभी प्रकाशित नहीं हुआ है।",

      camera_required: "परीक्षा शुरू करने के लिए कैमरा एक्सेस आवश्यक है।",
      fullscreen_required: "परीक्षा के दौरान पूर्ण स्क्रीन मोड आवश्यक है।",
      accept_and_start: "स्वीकार करें और परीक्षा शुरू करें",

      landing: {
  ai_powered_platform: "एआई संचालित परीक्षा प्लेटफ़ॉर्म",
  smarter_exams: "बेहतर परीक्षाएँ।",
  better_results: "बेहतर परिणाम।",
  faster_grading: "तेज़ मूल्यांकन।",
  smarter_insights: "बेहतर विश्लेषण।",
  hero_description:
    "छात्रों, परीक्षकों और प्रशासकों के लिए बनाया गया एक सुरक्षित और बुद्धिमान परीक्षा प्लेटफ़ॉर्म।",
  get_started: "शुरू करें",
  login: "लॉगिन",
  user_roles: "उपयोगकर्ता भूमिकाएँ",
  ai_powered: "एआई संचालित",
  available: "उपलब्ध",

  ai_examination_platform: "एआई परीक्षा प्लेटफ़ॉर्म",
  dashboard: "डैशबोर्ड",
  exams: "परीक्षाएँ",
  results: "परिणाम",
  settings: "सेटिंग्स",
  welcome_back: "वापसी पर स्वागत है",
  examination_overview: "यहाँ आपका परीक्षा विवरण है",
  examinations: "परीक्षाएँ",
  completed: "पूर्ण",
  average_score: "औसत अंक",
  performance: "प्रदर्शन",
  this_month: "इस महीने",

  trusted_institutions:
    "आधुनिक संस्थानों द्वारा विश्वसनीय",
  university: "विश्वविद्यालय",
  academy: "अकादमी",
  institute: "संस्थान",
  coaching: "कोचिंग",
  lab: "प्रयोगशाला",

  platform_features: "प्लेटफ़ॉर्म सुविधाएँ",
  everything_you_need: "आधुनिक",
  modern_examinations: "परीक्षाओं के लिए सब कुछ",
  features_description:
    "पूरी परीक्षा प्रक्रिया को एक केंद्रीकृत प्लेटफ़ॉर्म से प्रबंधित करें।",

  student_portal: "छात्र पोर्टल",
  student_portal_description:
    "परीक्षाओं में भाग लें, उत्तर जमा करें और परिणाम देखें।",

  examiner_portal: "परीक्षक पोर्टल",
  examiner_portal_description:
    "परीक्षाएँ बनाएँ, प्रश्न प्रबंधित करें और प्रदर्शन का मूल्यांकन करें।",

  admin_control: "प्रशासक नियंत्रण",
  admin_control_description:
    "उपयोगकर्ताओं, परीक्षक अनुमोदन और पूरे प्लेटफ़ॉर्म को प्रबंधित करें।",

  ai_powered_description:
    "आधुनिक परीक्षा अनुभव के लिए बुद्धिमान तकनीक।",

  how_it_works: "यह कैसे काम करता है",
  get_started_in: "शुरू करें",
  three_simple_steps: "3 आसान चरणों में",

  register: "पंजीकरण करें",
  register_description:
    "छात्र, परीक्षक या प्रशासक के रूप में अपना खाता बनाएँ।",

  attend_or_create: "भाग लें या बनाएँ",
  attend_or_create_description:
    "छात्र परीक्षा देते हैं। परीक्षक परीक्षाएँ बनाते और प्रबंधित करते हैं।",

  get_results: "परिणाम प्राप्त करें",
  get_results_description:
    "तुरंत प्रतिक्रिया, अंक और प्रदर्शन विश्लेषण प्राप्त करें।",

  about_platform: "प्लेटफ़ॉर्म के बारे में",
  built_for_the: "शिक्षा के",
  future_of_education: "भविष्य के लिए बनाया गया",

  about_description_one:
    "एआई परीक्षा प्लेटफ़ॉर्म छात्रों, परीक्षकों और प्रशासकों के लिए एक केंद्रीकृत वातावरण प्रदान करता है।",

  about_description_two:
    "पंजीकरण और परीक्षा प्रबंधन से लेकर परिणाम और प्रशासन तक, सब कुछ एक सुरक्षित प्लेटफ़ॉर्म पर व्यवस्थित है।",

  create_account: "खाता बनाएँ",

  faq: "सामान्य प्रश्न",
  frequently_asked: "अक्सर पूछे जाने वाले",
  questions: "प्रश्न",

  faq1_q: "इस प्लेटफ़ॉर्म का उपयोग कौन कर सकता है?",
  faq1_a:
    "छात्र, परीक्षक और प्रशासक — प्रत्येक के लिए अलग भूमिका-आधारित डैशबोर्ड उपलब्ध है।",

  faq2_q: "क्या यह प्लेटफ़ॉर्म एआई संचालित है?",
  faq2_a:
    "हाँ। एआई प्रश्न बनाने, उत्तरों का मूल्यांकन करने और प्रदर्शन का विश्लेषण करने में सहायता करता है।",

  faq3_q:
    "क्या परीक्षकों को प्रशासक की अनुमति चाहिए?",
  faq3_a:
    "हाँ। परीक्षक पंजीकरण करते हैं और परीक्षा बनाने से पहले प्रशासक की अनुमति की प्रतीक्षा करते हैं।",

  faq4_q:
    "क्या छात्र तुरंत परिणाम देख सकते हैं?",
  faq4_a:
    "परीक्षक द्वारा अपने डैशबोर्ड से परिणाम प्रकाशित करने के बाद छात्र परिणाम देख सकते हैं।",

  ready_to_get_started:
    "शुरू करने के लिए तैयार हैं?",

  start_journey_today:
    "आज ही अपनी परीक्षा यात्रा शुरू करें।",
},

nav: {
  features: "विशेषताएँ",
  about: "हमारे बारे में",
  login: "लॉगिन",
  register: "रजिस्टर करें",
},

footer: {
  platform: "AI परीक्षा प्लेटफ़ॉर्म",
  copyright: "© 2026 AI परीक्षा प्लेटफ़ॉर्म",
},

login: {
  smart_simple: "स्मार्ट और सरल परीक्षा प्लेटफ़ॉर्म",
  welcome: "स्वागत है",
  back: "वापस।",
  description:
    "अपनी परीक्षा यात्रा जारी रखने और सभी आवश्यक सुविधाओं तक एक ही स्थान पर पहुँचने के लिए साइन इन करें।",

  safe_secure: "सुरक्षित और गोपनीय",
  safe_secure_description:
    "आपकी खाता जानकारी सुरक्षित और निजी रखी जाती है।",

  everything_one_place: "सब कुछ एक ही स्थान पर",
  everything_one_place_description:
    "अपनी परीक्षाओं, परिणामों और गतिविधियों को आसानी से देखें।",

  easy_to_use: "उपयोग में आसान",
  easy_to_use_description:
    "सभी के लिए बनाया गया एक सरल अनुभव।",

  welcome_back: "वापसी पर स्वागत है",
  sign_in_description:
    "अपने खाते में जाने के लिए साइन इन करें।",

  email: "ईमेल पता",
  password: "पासवर्ड",
  password_placeholder: "अपना पासवर्ड दर्ज करें",

  remember_me: "मुझे याद रखें",

  logging_in: "लॉगिन हो रहा है...",
  sign_in: "साइन इन करें",

  no_account: "क्या आपका खाता नहीं है?",
  create_account: "खाता बनाएँ",

  back_home: "होम पर वापस जाएँ",

  invalid_credentials: "अमान्य ईमेल या पासवर्ड",
},

register: {
  smart_simple: "स्मार्ट और सरल परीक्षा प्लेटफ़ॉर्म",
  start_your: "अपनी",
  examination_journey: "परीक्षा यात्रा शुरू करें।",
  description:
    "अपना खाता बनाएँ और एक सरल, सुरक्षित और सुविधाजनक परीक्षा अनुभव का आनंद लें।",

  safe_secure: "सुरक्षित और गोपनीय",
  safe_secure_description:
    "आपका खाता और व्यक्तिगत जानकारी सुरक्षित रखी जाती है।",

  simple_examination: "सरल परीक्षा",
  simple_examination_description:
    "एक सुविधाजनक प्लेटफ़ॉर्म से आसानी से अपनी परीक्षाएँ दें।",

  track_progress: "अपनी प्रगति देखें",
  track_progress_description:
    "अपने परिणाम देखें और अपने परीक्षा प्रदर्शन पर नज़र रखें।",

  create_account: "अपना खाता बनाएँ",
  join_platform:
    "प्लेटफ़ॉर्म से जुड़ें और आज ही शुरुआत करें।",

  full_name: "पूरा नाम",
  full_name_placeholder: "अपना पूरा नाम दर्ज करें",

  email: "ईमेल पता",

  register_as: "मैं इसके रूप में पंजीकरण करना चाहता/चाहती हूँ",

  student: "छात्र",
  student_description: "परीक्षाएँ दें",

  examiner: "परीक्षक",
  examiner_description:
    "परीक्षाएँ बनाएँ और प्रबंधित करें",

  admin_approval: "प्रशासक की स्वीकृति आवश्यक है",
  admin_approval_description:
    "परीक्षक खाते तक पहुँच प्राप्त करने से पहले आपके पंजीकरण अनुरोध की समीक्षा एक प्रशासक द्वारा की जाएगी।",

  password: "पासवर्ड",
  password_placeholder: "पासवर्ड बनाएँ",
  password_hint: "कम से कम 6 अक्षरों का उपयोग करें।",

  confirm_password: "पासवर्ड की पुष्टि करें",
  confirm_password_placeholder:
    "अपना पासवर्ड फिर से दर्ज करें",

  creating_account: "खाता बनाया जा रहा है...",
  submit_request: "अनुरोध सबमिट करें",
  create_account_button: "खाता बनाएँ",

  already_account: "क्या आपका पहले से खाता है?",
  sign_in: "साइन इन करें",

  back_home: "होम पर वापस जाएँ",

  name_required: "कृपया अपना पूरा नाम दर्ज करें।",
  email_required: "कृपया अपना ईमेल पता दर्ज करें।",
  password_length:
    "आपके पासवर्ड में कम से कम 6 अक्षर होने चाहिए।",
  password_mismatch:
    "आपके द्वारा दर्ज किए गए पासवर्ड मेल नहीं खाते।",

  create_account_error:
    "हम आपका खाता नहीं बना सके। कृपया पुनः प्रयास करें।",

  connection_error:
    "खाता बनाने में असमर्थ। कृपया अपना कनेक्शन जाँचें और पुनः प्रयास करें।",

  examiner_success:
    "आपका अनुरोध सफलतापूर्वक सबमिट हो गया है। एक प्रशासक आपके अनुरोध की समीक्षा करेगा।",

  student_success:
    "आपका खाता सफलतापूर्वक बन गया है! आपको लॉगिन पेज पर ले जाया जा रहा है...",
},

admin: {
  role: "प्रशासक",
  logout: "लॉगआउट",
  toggle_menu: "मेनू बदलें",

  nav: {
    dashboard: "डैशबोर्ड",
    users: "उपयोगकर्ता",
    examinations: "परीक्षाएँ",
    examiner_requests: "परीक्षक अनुरोध",
  },

  login_required: "एडमिन लॉगिन आवश्यक है।",
  stats_error:
    "डैशबोर्ड आँकड़े लोड नहीं हो सके।",
  examiner_requests_error:
    "परीक्षक अनुरोध लोड नहीं हो सके।",

  approve_error:
    "परीक्षक को स्वीकृत नहीं किया जा सका।",
  reject_error:
    "परीक्षक को अस्वीकार नहीं किया जा सका।",

  examiner_approved:
    "परीक्षक सफलतापूर्वक स्वीकृत किया गया।",
  examiner_rejected:
    "परीक्षक को अस्वीकार कर दिया गया।",

  loading_dashboard:
    "एडमिन डैशबोर्ड लोड हो रहा है...",

  administration: "प्रशासन",
  dashboard_title: "एडमिन डैशबोर्ड",
  dashboard_subtitle:
    "उपयोगकर्ताओं, परीक्षाओं और प्लेटफ़ॉर्म की गतिविधियों को एक ही स्थान से प्रबंधित करें।",

  refresh: "रिफ्रेश",

  total_students: "कुल छात्र",
  total_examiners: "कुल परीक्षक",
  pending_requests: "लंबित अनुरोध",
  total_examinations: "कुल परीक्षाएँ",

  management: "प्रबंधन",
  quick_actions: "त्वरित कार्य",
  quick_actions_description:
    "मुख्य प्रशासनिक क्षेत्रों तक पहुँचें।",

  manage_users: "उपयोगकर्ताओं को प्रबंधित करें",
  manage_users_description:
    "छात्रों, परीक्षकों और प्रशासकों को देखें।",

  examiner_requests: "परीक्षक अनुरोध",
  examiner_requests_description:
    "लंबित परीक्षक पंजीकरण की समीक्षा करें।",

  examination_management: "परीक्षा प्रबंधन",
  examination_management_description:
    "परीक्षाओं, शेड्यूल और छात्र गतिविधियों की निगरानी करें।",

  platform: "प्लेटफ़ॉर्म",
  system_overview: "सिस्टम अवलोकन",

  users: "उपयोगकर्ता",
  students: "छात्र",
  examiners: "परीक्षक",
  approved_examiners: "स्वीकृत परीक्षक",

  examinations: "परीक्षाएँ",
  total_exams: "कुल परीक्षाएँ",
  published: "प्रकाशित",
  unpublished: "अप्रकाशित",

  examination_activity: "परीक्षा गतिविधि",
  total_attempts: "कुल प्रयास",
  submitted: "सबमिट किए गए",
  in_progress: "प्रगति में",

  user_management: "उपयोगकर्ता प्रबंधन",
  examiner_registration_requests:
    "परीक्षक पंजीकरण अनुरोध",
  examiner_registration_description:
    "परीक्षक पंजीकरण अनुरोधों की समीक्षा और प्रबंधन करें।",

  pending: "लंबित",
  loading_examiner_requests:
    "परीक्षक अनुरोध लोड हो रहे हैं...",

  no_pending_requests:
    "कोई लंबित अनुरोध नहीं",
  no_pending_requests_description:
    "वर्तमान में समीक्षा के लिए कोई परीक्षक पंजीकरण अनुरोध लंबित नहीं है।",

  pending_review: "समीक्षा लंबित",

  approve: "स्वीकृत करें",
  reject: "अस्वीकार करें",
},

    },
  },

  mr: {
    translation: {
      language: "भाषा",
      english: "इंग्रजी",
      hindi: "हिंदी",
      marathi: "मराठी",
      tamil: "तमिळ",
      malayalam: "मल्याळम",
      kannada: "कन्नड",
      telugu: "तेलुगू",

      dashboard: "डॅशबोर्ड",
      student_portal: "विद्यार्थी पोर्टल",
      examiner_portal: "परीक्षक पोर्टल",
      admin_portal: "प्रशासक पोर्टल",

      home: "मुख्यपृष्ठ",
      exams: "परीक्षा",
      results: "निकाल",
      submissions: "सबमिशन्स",
      questions: "प्रश्न",
      profile: "प्रोफाइल",
      settings: "सेटिंग्ज",
      logout: "लॉग आउट",

      welcome: "स्वागत आहे",
      start_exam: "परीक्षा सुरू करा",
      view_exam: "परीक्षा पहा",
      view_result: "निकाल पहा",
      check_answers: "उत्तरे तपासा",
      publish_results: "निकाल प्रकाशित करा",

      upcoming: "आगामी",
      active: "सक्रिय",
      completed: "पूर्ण",
      in_progress: "प्रगतीपथावर",

      exam_name: "परीक्षेचे नाव",
      subject: "विषय",
      duration: "कालावधी",
      maximum_marks: "कमाल गुण",
      total_questions: "एकूण प्रश्न",
      score: "गुण",
      correct: "बरोबर",
      wrong: "चुकीचे",
      unanswered: "अनुत्तरित",

      loading: "लोड होत आहे...",
      save: "जतन करा",
      cancel: "रद्द करा",
      back: "मागे",
      next: "पुढे",
      previous: "मागील",
      submit: "सबमिट करा",
      search: "शोधा",

      no_exams: "कोणतीही परीक्षा उपलब्ध नाही.",
      no_submissions: "अद्याप कोणत्याही विद्यार्थ्याने ही परीक्षा सबमिट केलेली नाही.",
      result_not_published: "निकाल अद्याप प्रकाशित झालेला नाही.",

      camera_required: "परीक्षा सुरू करण्यासाठी कॅमेरा प्रवेश आवश्यक आहे.",
      fullscreen_required: "परीक्षेदरम्यान पूर्ण स्क्रीन मोड आवश्यक आहे.",
      accept_and_start: "स्वीकारा आणि परीक्षा सुरू करा",

      landing: {
  ai_powered_platform: "एआय आधारित परीक्षा प्लॅटफॉर्म",
  smarter_exams: "स्मार्ट परीक्षा.",
  better_results: "चांगले निकाल.",
  faster_grading: "जलद मूल्यांकन.",
  smarter_insights: "स्मार्ट विश्लेषण.",
  hero_description:
    "विद्यार्थी, परीक्षक आणि प्रशासकांसाठी तयार केलेले सुरक्षित आणि बुद्धिमान परीक्षा प्लॅटफॉर्म.",
  get_started: "सुरू करा",
  login: "लॉगिन",
  user_roles: "वापरकर्ता भूमिका",
  ai_powered: "एआय आधारित",
  available: "उपलब्ध",

  ai_examination_platform: "एआय परीक्षा प्लॅटफॉर्म",
  dashboard: "डॅशबोर्ड",
  exams: "परीक्षा",
  results: "निकाल",
  settings: "सेटिंग्ज",
  welcome_back: "पुन्हा स्वागत आहे",
  examination_overview: "तुमचा परीक्षा आढावा येथे आहे",
  examinations: "परीक्षा",
  completed: "पूर्ण",
  average_score: "सरासरी गुण",
  performance: "कामगिरी",
  this_month: "या महिन्यात",

  trusted_institutions:
    "आधुनिक संस्थांचा विश्वास",
  university: "विद्यापीठ",
  academy: "अकादमी",
  institute: "संस्था",
  coaching: "कोचिंग",
  lab: "प्रयोगशाळा",

  platform_features: "प्लॅटफॉर्म वैशिष्ट्ये",
  everything_you_need: "आधुनिक",
  modern_examinations: "परीक्षांसाठी आवश्यक सर्व काही",
  features_description:
    "संपूर्ण परीक्षा प्रक्रिया एका केंद्रीकृत प्लॅटफॉर्मवर व्यवस्थापित करा.",

  student_portal: "विद्यार्थी पोर्टल",
  student_portal_description:
    "परीक्षांना उपस्थित राहा, उत्तरे जमा करा आणि निकाल पहा.",

  examiner_portal: "परीक्षक पोर्टल",
  examiner_portal_description:
    "परीक्षा तयार करा, प्रश्न व्यवस्थापित करा आणि कामगिरीचे मूल्यांकन करा.",

  admin_control: "प्रशासक नियंत्रण",
  admin_control_description:
    "वापरकर्ते, परीक्षक मंजुरी आणि संपूर्ण प्लॅटफॉर्म व्यवस्थापित करा.",

  ai_powered_description:
    "आधुनिक परीक्षा अनुभवासाठी बुद्धिमान तंत्रज्ञान.",

  how_it_works: "हे कसे कार्य करते",
  get_started_in: "सुरुवात करा",
  three_simple_steps: "३ सोप्या चरणांमध्ये",

  register: "नोंदणी करा",
  register_description:
    "विद्यार्थी, परीक्षक किंवा प्रशासक म्हणून आपले खाते तयार करा.",

  attend_or_create: "परीक्षा द्या किंवा तयार करा",
  attend_or_create_description:
    "विद्यार्थी परीक्षा देतात. परीक्षक परीक्षा तयार आणि व्यवस्थापित करतात.",

  get_results: "निकाल मिळवा",
  get_results_description:
    "त्वरित अभिप्राय, गुण आणि कामगिरीचे विश्लेषण मिळवा.",

  about_platform: "प्लॅटफॉर्मबद्दल",
  built_for_the: "शिक्षणाच्या",
  future_of_education: "भविष्यासाठी तयार केलेले",

  about_description_one:
    "एआय परीक्षा प्लॅटफॉर्म विद्यार्थी, परीक्षक आणि प्रशासकांसाठी केंद्रीकृत वातावरण प्रदान करतो.",

  about_description_two:
    "नोंदणी आणि परीक्षा व्यवस्थापनापासून निकाल आणि प्रशासनापर्यंत सर्व काही एका सुरक्षित प्लॅटफॉर्मवर व्यवस्थित केले आहे.",

  create_account: "खाते तयार करा",

  faq: "सामान्य प्रश्न",
  frequently_asked: "वारंवार विचारले जाणारे",
  questions: "प्रश्न",

  faq1_q: "हा प्लॅटफॉर्म कोण वापरू शकतो?",
  faq1_a:
    "विद्यार्थी, परीक्षक आणि प्रशासक — प्रत्येकासाठी स्वतंत्र भूमिका-आधारित डॅशबोर्ड उपलब्ध आहे.",

  faq2_q: "हा प्लॅटफॉर्म एआय आधारित आहे का?",
  faq2_a:
    "होय. एआय प्रश्न तयार करणे, उत्तरांचे मूल्यांकन करणे आणि कामगिरीचे विश्लेषण करण्यात मदत करते.",

  faq3_q:
    "परीक्षकांना प्रशासकाची मंजुरी आवश्यक आहे का?",
  faq3_a:
    "होय. परीक्षक नोंदणी करतात आणि परीक्षा तयार करण्यापूर्वी प्रशासकाच्या मंजुरीची प्रतीक्षा करतात.",

  faq4_q:
    "विद्यार्थी निकाल लगेच पाहू शकतात का?",
  faq4_a:
    "परीक्षकाने त्यांच्या डॅशबोर्डवरून निकाल प्रकाशित केल्यानंतर विद्यार्थी निकाल पाहू शकतात.",

  ready_to_get_started:
    "सुरू करण्यासाठी तयार आहात?",

  start_journey_today:
    "आजच तुमची परीक्षा यात्रा सुरू करा.",
},

nav: {
  features: "वैशिष्ट्ये",
  about: "आमच्याबद्दल",
  login: "लॉगिन",
  register: "नोंदणी करा",
},

footer: {
  platform: "AI परीक्षा प्लॅटफॉर्म",
  copyright: "© 2026 AI परीक्षा प्लॅटफॉर्म",
},

login: {
  smart_simple: "स्मार्ट आणि सोपे परीक्षा प्लॅटफॉर्म",
  welcome: "स्वागत आहे",
  back: "पुन्हा.",
  description:
    "तुमचा परीक्षा प्रवास सुरू ठेवण्यासाठी आणि आवश्यक सर्व सुविधांपर्यंत एकाच ठिकाणी पोहोचण्यासाठी साइन इन करा.",

  safe_secure: "सुरक्षित आणि गोपनीय",
  safe_secure_description:
    "तुमची खाते माहिती सुरक्षित आणि खाजगी ठेवली जाते.",

  everything_one_place: "सर्व काही एका ठिकाणी",
  everything_one_place_description:
    "तुमच्या परीक्षा, निकाल आणि उपक्रम सहजपणे पाहा.",

  easy_to_use: "वापरण्यास सोपे",
  easy_to_use_description:
    "प्रत्येकासाठी तयार केलेला सोपा अनुभव.",

  welcome_back: "पुन्हा स्वागत आहे",
  sign_in_description:
    "तुमच्या खात्यात जाण्यासाठी साइन इन करा.",

  email: "ईमेल पत्ता",
  password: "पासवर्ड",
  password_placeholder: "तुमचा पासवर्ड प्रविष्ट करा",

  remember_me: "मला लक्षात ठेवा",

  logging_in: "लॉगिन होत आहे...",
  sign_in: "साइन इन करा",

  no_account: "तुमचे खाते नाही?",
  create_account: "खाते तयार करा",

  back_home: "मुख्यपृष्ठावर परत जा",

  invalid_credentials: "अवैध ईमेल किंवा पासवर्ड",
},

register: {
  smart_simple: "स्मार्ट आणि सोपे परीक्षा प्लॅटफॉर्म",
  start_your: "तुमचा",
  examination_journey: "परीक्षा प्रवास सुरू करा.",
  description:
    "तुमचे खाते तयार करा आणि सोपा, सुरक्षित व सोयीस्कर परीक्षा अनुभव मिळवा.",

  safe_secure: "सुरक्षित आणि गोपनीय",
  safe_secure_description:
    "तुमचे खाते आणि वैयक्तिक माहिती सुरक्षित ठेवली जाते.",

  simple_examination: "सोपी परीक्षा",
  simple_examination_description:
    "एका सोयीस्कर प्लॅटफॉर्मवरून सहजपणे परीक्षा द्या.",

  track_progress: "तुमची प्रगती पाहा",
  track_progress_description:
    "तुमचे निकाल पाहा आणि तुमच्या परीक्षा कामगिरीचा मागोवा घ्या.",

  create_account: "तुमचे खाते तयार करा",
  join_platform:
    "प्लॅटफॉर्ममध्ये सामील व्हा आणि आजच सुरुवात करा.",

  full_name: "पूर्ण नाव",
  full_name_placeholder: "तुमचे पूर्ण नाव प्रविष्ट करा",

  email: "ईमेल पत्ता",

  register_as: "मला याप्रमाणे नोंदणी करायची आहे",

  student: "विद्यार्थी",
  student_description: "परीक्षा द्या",

  examiner: "परीक्षक",
  examiner_description:
    "परीक्षा तयार करा आणि व्यवस्थापित करा",

  admin_approval: "प्रशासकाची मंजुरी आवश्यक आहे",
  admin_approval_description:
    "परीक्षक खात्याचा प्रवेश मिळण्यापूर्वी तुमच्या नोंदणी विनंतीचे प्रशासकाकडून पुनरावलोकन केले जाईल.",

  password: "पासवर्ड",
  password_placeholder: "पासवर्ड तयार करा",
  password_hint: "किमान 6 अक्षरे वापरा.",

  confirm_password: "पासवर्डची पुष्टी करा",
  confirm_password_placeholder:
    "तुमचा पासवर्ड पुन्हा प्रविष्ट करा",

  creating_account: "खाते तयार होत आहे...",
  submit_request: "विनंती सबमिट करा",
  create_account_button: "खाते तयार करा",

  already_account: "तुमचे आधीपासून खाते आहे?",
  sign_in: "साइन इन करा",

  back_home: "मुख्यपृष्ठावर परत जा",

  name_required: "कृपया तुमचे पूर्ण नाव प्रविष्ट करा.",
  email_required: "कृपया तुमचा ईमेल पत्ता प्रविष्ट करा.",
  password_length:
    "तुमच्या पासवर्डमध्ये किमान 6 अक्षरे असणे आवश्यक आहे.",
  password_mismatch:
    "तुम्ही प्रविष्ट केलेले पासवर्ड जुळत नाहीत.",

  create_account_error:
    "आम्ही तुमचे खाते तयार करू शकलो नाही. कृपया पुन्हा प्रयत्न करा.",

  connection_error:
    "तुमचे खाते तयार करता आले नाही. कृपया तुमचे कनेक्शन तपासा आणि पुन्हा प्रयत्न करा.",

  examiner_success:
    "तुमची विनंती यशस्वीपणे सबमिट झाली आहे. प्रशासक तुमच्या विनंतीचे पुनरावलोकन करेल.",

  student_success:
    "तुमचे खाते यशस्वीपणे तयार झाले आहे! तुम्हाला लॉगिन पेजवर नेले जात आहे...",
},

admin: {
  role: "प्रशासक",
  logout: "लॉगआउट",
  toggle_menu: "मेनू बदला",

  nav: {
    dashboard: "डॅशबोर्ड",
    users: "वापरकर्ते",
    examinations: "परीक्षा",
    examiner_requests: "परीक्षक विनंत्या",
  },

  login_required: "अॅडमिन लॉगिन आवश्यक आहे.",
  stats_error:
    "डॅशबोर्ड आकडेवारी लोड करता आली नाही.",
  examiner_requests_error:
    "परीक्षक विनंत्या लोड करता आल्या नाहीत.",

  approve_error:
    "परीक्षकाला मंजूर करता आले नाही.",
  reject_error:
    "परीक्षकाला नाकारता आले नाही.",

  examiner_approved:
    "परीक्षक यशस्वीपणे मंजूर झाला.",
  examiner_rejected:
    "परीक्षक नाकारला गेला.",

  loading_dashboard:
    "अॅडमिन डॅशबोर्ड लोड होत आहे...",

  administration: "प्रशासन",
  dashboard_title: "अॅडमिन डॅशबोर्ड",
  dashboard_subtitle:
    "वापरकर्ते, परीक्षा आणि प्लॅटफॉर्मची गतिविधी एका ठिकाणाहून व्यवस्थापित करा.",

  refresh: "रिफ्रेश",

  total_students: "एकूण विद्यार्थी",
  total_examiners: "एकूण परीक्षक",
  pending_requests: "प्रलंबित विनंत्या",
  total_examinations: "एकूण परीक्षा",

  management: "व्यवस्थापन",
  quick_actions: "जलद कृती",
  quick_actions_description:
    "मुख्य प्रशासकीय विभागांमध्ये प्रवेश करा.",

  manage_users: "वापरकर्ते व्यवस्थापित करा",
  manage_users_description:
    "विद्यार्थी, परीक्षक आणि प्रशासक पहा.",

  examiner_requests: "परीक्षक विनंत्या",
  examiner_requests_description:
    "प्रलंबित परीक्षक नोंदणींचे पुनरावलोकन करा.",

  examination_management: "परीक्षा व्यवस्थापन",
  examination_management_description:
    "परीक्षा, वेळापत्रक आणि विद्यार्थी गतिविधीचे निरीक्षण करा.",

  platform: "प्लॅटफॉर्म",
  system_overview: "सिस्टम आढावा",

  users: "वापरकर्ते",
  students: "विद्यार्थी",
  examiners: "परीक्षक",
  approved_examiners: "मंजूर परीक्षक",

  examinations: "परीक्षा",
  total_exams: "एकूण परीक्षा",
  published: "प्रकाशित",
  unpublished: "अप्रकाशित",

  examination_activity: "परीक्षा गतिविधी",
  total_attempts: "एकूण प्रयत्न",
  submitted: "सबमिट केलेले",
  in_progress: "प्रगतीपथावर",

  user_management: "वापरकर्ता व्यवस्थापन",
  examiner_registration_requests:
    "परीक्षक नोंदणी विनंत्या",
  examiner_registration_description:
    "परीक्षक नोंदणी विनंत्यांचे पुनरावलोकन आणि व्यवस्थापन करा.",

  pending: "प्रलंबित",
  loading_examiner_requests:
    "परीक्षक विनंत्या लोड होत आहेत...",

  no_pending_requests:
    "कोणत्याही प्रलंबित विनंत्या नाहीत",
  no_pending_requests_description:
    "सध्या पुनरावलोकनासाठी कोणत्याही परीक्षक नोंदणी विनंत्या प्रलंबित नाहीत.",

  pending_review: "पुनरावलोकन प्रलंबित",

  approve: "मंजूर करा",
  reject: "नकार द्या",
},
    },
  },

  ta: {
    translation: {
      language: "மொழி",
      english: "ஆங்கிலம்",
      hindi: "இந்தி",
      marathi: "மராத்தி",
      tamil: "தமிழ்",
      malayalam: "மலையாளம்",
      kannada: "கன்னடம்",
      telugu: "தெலுங்கு",

      dashboard: "டாஷ்போர்டு",
      student_portal: "மாணவர் போர்டல்",
      examiner_portal: "தேர்வாளர் போர்டல்",
      admin_portal: "நிர்வாகி போர்டல்",

      home: "முகப்பு",
      exams: "தேர்வுகள்",
      results: "முடிவுகள்",
      submissions: "சமர்ப்பிப்புகள்",
      questions: "கேள்விகள்",
      profile: "சுயவிவரம்",
      settings: "அமைப்புகள்",
      logout: "வெளியேறு",

      welcome: "வரவேற்கிறோம்",
      start_exam: "தேர்வைத் தொடங்குங்கள்",
      view_exam: "தேர்வைப் பார்க்கவும்",
      view_result: "முடிவைப் பார்க்கவும்",
      check_answers: "பதில்களைச் சரிபார்க்கவும்",
      publish_results: "முடிவுகளை வெளியிடவும்",

      upcoming: "வரவிருக்கும்",
      active: "செயலில்",
      completed: "முடிந்தது",
      in_progress: "நடைபெறுகிறது",

      exam_name: "தேர்வின் பெயர்",
      subject: "பாடம்",
      duration: "கால அளவு",
      maximum_marks: "அதிகபட்ச மதிப்பெண்கள்",
      total_questions: "மொத்த கேள்விகள்",
      score: "மதிப்பெண்",
      correct: "சரி",
      wrong: "தவறு",
      unanswered: "பதிலளிக்கப்படாதவை",

      loading: "ஏற்றப்படுகிறது...",
      save: "சேமி",
      cancel: "ரத்து செய்",
      back: "பின்செல்",
      next: "அடுத்து",
      previous: "முந்தைய",
      submit: "சமர்ப்பி",
      search: "தேடு",

      no_exams: "தேர்வுகள் எதுவும் கிடைக்கவில்லை.",
      no_submissions: "இதுவரை எந்த மாணவரும் இந்தத் தேர்வை சமர்ப்பிக்கவில்லை.",
      result_not_published: "முடிவு இன்னும் வெளியிடப்படவில்லை.",

      camera_required: "தேர்வைத் தொடங்க கேமரா அணுகல் தேவை.",
      fullscreen_required: "தேர்வின்போது முழுத்திரை பயன்முறை தேவை.",
      accept_and_start: "ஏற்று மற்றும் தேர்வைத் தொடங்கு",

      landing: {
  ai_powered_platform: "AI இயக்கப்படும் தேர்வு தளம்",
  smarter_exams: "சிறந்த தேர்வுகள்.",
  better_results: "சிறந்த முடிவுகள்.",
  faster_grading: "வேகமான மதிப்பீடு.",
  smarter_insights: "சிறந்த பகுப்பாய்வு.",
  hero_description:
    "மாணவர்கள், தேர்வாளர்கள் மற்றும் நிர்வாகிகளுக்காக உருவாக்கப்பட்ட பாதுகாப்பான மற்றும் புத்திசாலித்தனமான தேர்வு தளம்.",
  get_started: "தொடங்குங்கள்",
  login: "உள்நுழைய",
  user_roles: "பயனர் பொறுப்புகள்",
  ai_powered: "AI இயக்கப்படுகிறது",
  available: "கிடைக்கிறது",

  ai_examination_platform: "AI தேர்வு தளம்",
  dashboard: "டாஷ்போர்டு",
  exams: "தேர்வுகள்",
  results: "முடிவுகள்",
  settings: "அமைப்புகள்",
  welcome_back: "மீண்டும் வரவேற்கிறோம்",
  examination_overview: "உங்கள் தேர்வு மேலோட்டம் இதோ",
  examinations: "தேர்வுகள்",
  completed: "நிறைவடைந்தது",
  average_score: "சராசரி மதிப்பெண்",
  performance: "செயல்திறன்",
  this_month: "இந்த மாதம்",

  trusted_institutions:
    "முன்னோக்கிய நிறுவனங்களால் நம்பப்படுகிறது",
  university: "பல்கலைக்கழகம்",
  academy: "அகாடமி",
  institute: "நிறுவனம்",
  coaching: "பயிற்சி மையம்",
  lab: "ஆய்வகம்",

  platform_features: "தள அம்சங்கள்",
  everything_you_need: "நவீன",
  modern_examinations: "தேர்வுகளுக்குத் தேவையான அனைத்தும்",
  features_description:
    "முழுமையான தேர்வு செயல்முறையை ஒரே மையப்படுத்தப்பட்ட தளத்தில் நிர்வகிக்கவும்.",

  student_portal: "மாணவர் தளம்",
  student_portal_description:
    "தேர்வுகளில் பங்கேற்று, பதில்களைச் சமர்ப்பித்து, முடிவுகளைப் பார்க்கவும்.",

  examiner_portal: "தேர்வாளர் தளம்",
  examiner_portal_description:
    "தேர்வுகளை உருவாக்கி, கேள்விகளை நிர்வகித்து, செயல்திறனை மதிப்பீடு செய்யவும்.",

  admin_control: "நிர்வாகக் கட்டுப்பாடு",
  admin_control_description:
    "பயனர்கள், தேர்வாளர் அனுமதிகள் மற்றும் முழு தளத்தையும் நிர்வகிக்கவும்.",

  ai_powered_description:
    "நவீன தேர்வு அனுபவத்திற்கான புத்திசாலித்தனமான தொழில்நுட்பம்.",

  how_it_works: "இது எப்படி செயல்படுகிறது",
  get_started_in: "தொடங்குங்கள்",
  three_simple_steps: "3 எளிய படிகளில்",

  register: "பதிவு செய்யவும்",
  register_description:
    "மாணவர், தேர்வாளர் அல்லது நிர்வாகியாக உங்கள் கணக்கை உருவாக்கவும்.",

  attend_or_create: "பங்கேற்கவும் அல்லது உருவாக்கவும்",
  attend_or_create_description:
    "மாணவர்கள் தேர்வுகளை எழுதுகிறார்கள். தேர்வாளர்கள் தேர்வுகளை உருவாக்கி நிர்வகிக்கிறார்கள்.",

  get_results: "முடிவுகளைப் பெறுங்கள்",
  get_results_description:
    "உடனடி கருத்து, மதிப்பெண்கள் மற்றும் செயல்திறன் பகுப்பாய்வைப் பெறுங்கள்.",

  about_platform: "தளம் பற்றி",
  built_for_the: "கல்வியின்",
  future_of_education: "எதிர்காலத்திற்காக உருவாக்கப்பட்டது",

  about_description_one:
    "AI தேர்வு தளம் மாணவர்கள், தேர்வாளர்கள் மற்றும் நிர்வாகிகளுக்கான மையப்படுத்தப்பட்ட சூழலை வழங்குகிறது.",

  about_description_two:
    "பதிவு மற்றும் தேர்வு நிர்வாகம் முதல் முடிவுகள் மற்றும் நிர்வாகம் வரை அனைத்தும் ஒரே பாதுகாப்பான தளத்தில் ஒழுங்கமைக்கப்பட்டுள்ளது.",

  create_account: "கணக்கை உருவாக்கவும்",

  faq: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
  frequently_asked: "அடிக்கடி கேட்கப்படும்",
  questions: "கேள்விகள்",

  faq1_q: "இந்த தளத்தை யார் பயன்படுத்தலாம்?",
  faq1_a:
    "மாணவர்கள், தேர்வாளர்கள் மற்றும் நிர்வாகிகள் — ஒவ்வொருவருக்கும் தனிப்பட்ட பங்கு அடிப்படையிலான டாஷ்போர்டு உள்ளது.",

  faq2_q: "இந்த தளம் AI மூலம் இயக்கப்படுகிறதா?",
  faq2_a:
    "ஆம். கேள்விகளை உருவாக்குதல், பதில்களை மதிப்பீடு செய்தல் மற்றும் செயல்திறனை பகுப்பாய்வு செய்தல் போன்றவற்றில் AI உதவுகிறது.",

  faq3_q: "தேர்வாளர்களுக்கு நிர்வாக அனுமதி தேவையா?",
  faq3_a:
    "ஆம். தேர்வாளர்கள் பதிவு செய்து, தேர்வுகளை உருவாக்குவதற்கு முன் நிர்வாகியின் அனுமதிக்காக காத்திருக்க வேண்டும்.",

  faq4_q: "மாணவர்கள் உடனடியாக முடிவுகளைப் பார்க்க முடியுமா?",
  faq4_a:
    "தேர்வாளர் தனது டாஷ்போர்டிலிருந்து முடிவுகளை வெளியிட்டவுடன் மாணவர்கள் அவற்றைப் பார்க்கலாம்.",

  ready_to_get_started: "தொடங்கத் தயாரா?",
  start_journey_today:
    "இன்றே உங்கள் தேர்வு பயணத்தைத் தொடங்குங்கள்.",
},

nav: {
  features: "அம்சங்கள்",
  about: "எங்களைப் பற்றி",
  login: "உள்நுழைய",
  register: "பதிவு செய்யவும்",
},

footer: {
  platform: "AI தேர்வு தளம்",
  copyright: "© 2026 AI தேர்வு தளம்",
},

login: {
  smart_simple: "ஸ்மார்ட் மற்றும் எளிய தேர்வு தளம்",
  welcome: "வரவேற்கிறோம்",
  back: "மீண்டும்.",
  description:
    "உங்கள் தேர்வு பயணத்தைத் தொடரவும், தேவையான அனைத்தையும் ஒரே இடத்தில் அணுகவும் உள்நுழையுங்கள்.",

  safe_secure: "பாதுகாப்பானது மற்றும் பாதுகாப்புடன்",
  safe_secure_description:
    "உங்கள் கணக்கு தகவல்கள் பாதுகாப்பாகவும் தனிப்பட்டதாகவும் வைக்கப்படுகின்றன.",

  everything_one_place: "அனைத்தும் ஒரே இடத்தில்",
  everything_one_place_description:
    "உங்கள் தேர்வுகள், முடிவுகள் மற்றும் செயல்பாடுகளை எளிதாக அணுகுங்கள்.",

  easy_to_use: "பயன்படுத்த எளிதானது",
  easy_to_use_description:
    "அனைவருக்காகவும் வடிவமைக்கப்பட்ட எளிய அனுபவம்.",

  welcome_back: "மீண்டும் வரவேற்கிறோம்",
  sign_in_description:
    "உங்கள் கணக்கைத் தொடர உள்நுழையுங்கள்.",

  email: "மின்னஞ்சல் முகவரி",
  password: "கடவுச்சொல்",
  password_placeholder: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",

  remember_me: "என்னை நினைவில் வைத்திருக்கவும்",

  logging_in: "உள்நுழைகிறது...",
  sign_in: "உள்நுழைய",

  no_account: "கணக்கு இல்லையா?",
  create_account: "கணக்கை உருவாக்கவும்",

  back_home: "முகப்புக்குத் திரும்பு",

  invalid_credentials: "தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்",
},
register: {
  smart_simple: "ஸ்மார்ட் மற்றும் எளிய தேர்வு தளம்",
  start_your: "உங்கள்",
  examination_journey: "தேர்வு பயணத்தைத் தொடங்குங்கள்.",
  description:
    "உங்கள் கணக்கை உருவாக்கி எளிய, பாதுகாப்பான மற்றும் வசதியான தேர்வு அனுபவத்தைப் பெறுங்கள்.",

  safe_secure: "பாதுகாப்பானது",
  safe_secure_description:
    "உங்கள் கணக்கு மற்றும் தனிப்பட்ட தகவல்கள் பாதுகாப்பாக வைக்கப்படுகின்றன.",

  simple_examination: "எளிய தேர்வு",
  simple_examination_description:
    "ஒரே வசதியான தளத்தில் உங்கள் தேர்வுகளை எளிதாக எழுதுங்கள்.",

  track_progress: "உங்கள் முன்னேற்றத்தைக் கண்காணிக்கவும்",
  track_progress_description:
    "உங்கள் முடிவுகளைப் பார்த்து தேர்வு செயல்திறனைக் கண்காணிக்கவும்.",

  create_account: "உங்கள் கணக்கை உருவாக்கவும்",
  join_platform:
    "தளத்தில் இணைந்து இன்றே தொடங்குங்கள்.",

  full_name: "முழுப் பெயர்",
  full_name_placeholder: "உங்கள் முழுப் பெயரை உள்ளிடவும்",

  email: "மின்னஞ்சல் முகவரி",

  register_as: "நான் இதன்படி பதிவு செய்ய விரும்புகிறேன்",

  student: "மாணவர்",
  student_description: "தேர்வுகளை எழுதுங்கள்",

  examiner: "தேர்வாளர்",
  examiner_description:
    "தேர்வுகளை உருவாக்கி நிர்வகிக்கவும்",

  admin_approval: "நிர்வாகியின் ஒப்புதல் தேவை",
  admin_approval_description:
    "தேர்வாளர் கணக்கை அணுகுவதற்கு முன் உங்கள் பதிவு கோரிக்கை நிர்வாகியால் மதிப்பாய்வு செய்யப்படும்.",

  password: "கடவுச்சொல்",
  password_placeholder: "கடவுச்சொல்லை உருவாக்கவும்",
  password_hint: "குறைந்தது 6 எழுத்துகளைப் பயன்படுத்தவும்.",

  confirm_password: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
  confirm_password_placeholder:
    "உங்கள் கடவுச்சொல்லை மீண்டும் உள்ளிடவும்",

  creating_account: "கணக்கு உருவாக்கப்படுகிறது...",
  submit_request: "கோரிக்கையைச் சமர்ப்பிக்கவும்",
  create_account_button: "கணக்கை உருவாக்கவும்",

  already_account: "ஏற்கனவே கணக்கு உள்ளதா?",
  sign_in: "உள்நுழைய",

  back_home: "முகப்புக்குத் திரும்பு",

  name_required: "உங்கள் முழுப் பெயரை உள்ளிடவும்.",
  email_required: "உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
  password_length:
    "உங்கள் கடவுச்சொல்லில் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.",
  password_mismatch:
    "நீங்கள் உள்ளிட்ட கடவுச்சொற்கள் பொருந்தவில்லை.",

  create_account_error:
    "உங்கள் கணக்கை உருவாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",

  connection_error:
    "உங்கள் கணக்கை உருவாக்க முடியவில்லை. உங்கள் இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.",

  examiner_success:
    "உங்கள் கோரிக்கை வெற்றிகரமாகச் சமர்ப்பிக்கப்பட்டது. நிர்வாகி உங்கள் கோரிக்கையை மதிப்பாய்வு செய்வார்.",

  student_success:
    "உங்கள் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது! உங்களை உள்நுழைவு பக்கத்திற்கு அழைத்துச் செல்கிறோம்...",
},

admin: {
  role: "நிர்வாகி",
  logout: "வெளியேறு",
  toggle_menu: "மெனுவை மாற்று",

  nav: {
    dashboard: "டாஷ்போர்டு",
    users: "பயனர்கள்",
    examinations: "தேர்வுகள்",
    examiner_requests: "தேர்வாளர் கோரிக்கைகள்",
  },

  login_required: "நிர்வாகி உள்நுழைவு தேவை.",
  stats_error:
    "டாஷ்போர்டு புள்ளிவிவரங்களை ஏற்ற முடியவில்லை.",
  examiner_requests_error:
    "தேர்வாளர் கோரிக்கைகளை ஏற்ற முடியவில்லை.",

  approve_error:
    "தேர்வாளரை அங்கீகரிக்க முடியவில்லை.",
  reject_error:
    "தேர்வாளரை நிராகரிக்க முடியவில்லை.",

  examiner_approved:
    "தேர்வாளர் வெற்றிகரமாக அங்கீகரிக்கப்பட்டார்.",
  examiner_rejected:
    "தேர்வாளர் நிராகரிக்கப்பட்டார்.",

  loading_dashboard:
    "நிர்வாகி டாஷ்போர்டு ஏற்றப்படுகிறது...",

  administration: "நிர்வாகம்",
  dashboard_title: "நிர்வாகி டாஷ்போர்டு",
  dashboard_subtitle:
    "பயனர்கள், தேர்வுகள் மற்றும் தள செயல்பாடுகளை ஒரே இடத்தில் நிர்வகிக்கவும்.",

  refresh: "புதுப்பிக்கவும்",

  total_students: "மொத்த மாணவர்கள்",
  total_examiners: "மொத்த தேர்வாளர்கள்",
  pending_requests: "நிலுவையிலுள்ள கோரிக்கைகள்",
  total_examinations: "மொத்த தேர்வுகள்",

  management: "மேலாண்மை",
  quick_actions: "விரைவு செயல்கள்",
  quick_actions_description:
    "முக்கிய நிர்வாகப் பகுதிகளை அணுகவும்.",

  manage_users: "பயனர்களை நிர்வகிக்கவும்",
  manage_users_description:
    "மாணவர்கள், தேர்வாளர்கள் மற்றும் நிர்வாகிகளைப் பார்க்கவும்.",

  examiner_requests: "தேர்வாளர் கோரிக்கைகள்",
  examiner_requests_description:
    "நிலுவையிலுள்ள தேர்வாளர் பதிவுகளை மதிப்பாய்வு செய்யவும்.",

  examination_management: "தேர்வு மேலாண்மை",
  examination_management_description:
    "தேர்வுகள், அட்டவணைகள் மற்றும் மாணவர் செயல்பாடுகளை கண்காணிக்கவும்.",

  platform: "தளம்",
  system_overview: "கணினி மேலோட்டம்",

  users: "பயனர்கள்",
  students: "மாணவர்கள்",
  examiners: "தேர்வாளர்கள்",
  approved_examiners: "அங்கீகரிக்கப்பட்ட தேர்வாளர்கள்",

  examinations: "தேர்வுகள்",
  total_exams: "மொத்த தேர்வுகள்",
  published: "வெளியிடப்பட்டவை",
  unpublished: "வெளியிடப்படாதவை",

  examination_activity: "தேர்வு செயல்பாடு",
  total_attempts: "மொத்த முயற்சிகள்",
  submitted: "சமர்ப்பிக்கப்பட்டவை",
  in_progress: "நடைபெறுகிறது",

  user_management: "பயனர் மேலாண்மை",
  examiner_registration_requests:
    "தேர்வாளர் பதிவு கோரிக்கைகள்",
  examiner_registration_description:
    "தேர்வாளர் பதிவு கோரிக்கைகளை மதிப்பாய்வு செய்து நிர்வகிக்கவும்.",

  pending: "நிலுவையில்",
  loading_examiner_requests:
    "தேர்வாளர் கோரிக்கைகள் ஏற்றப்படுகின்றன...",

  no_pending_requests:
    "நிலுவையில் உள்ள கோரிக்கைகள் இல்லை",
  no_pending_requests_description:
    "தற்போது மதிப்பாய்வுக்காக எந்த தேர்வாளர் பதிவு கோரிக்கைகளும் இல்லை.",

  pending_review: "மதிப்பாய்வு நிலுவையில்",

  approve: "அங்கீகரிக்கவும்",
  reject: "நிராகரிக்கவும்",
},

    },
  },

  ml: {
    translation: {
      language: "ഭാഷ",
      english: "ഇംഗ്ലീഷ്",
      hindi: "ഹിന്ദി",
      marathi: "മറാത്തി",
      tamil: "തമിഴ്",
      malayalam: "മലയാളം",
      kannada: "കന്നഡ",
      telugu: "തെലുങ്ക്",

      dashboard: "ഡാഷ്ബോർഡ്",
      student_portal: "വിദ്യാർത്ഥി പോർട്ടൽ",
      examiner_portal: "പരീക്ഷക പോർട്ടൽ",
      admin_portal: "അഡ്മിൻ പോർട്ടൽ",

      home: "ഹോം",
      exams: "പരീക്ഷകൾ",
      results: "ഫലങ്ങൾ",
      submissions: "സമർപ്പിക്കലുകൾ",
      questions: "ചോദ്യങ്ങൾ",
      profile: "പ്രൊഫൈൽ",
      settings: "ക്രമീകരണങ്ങൾ",
      logout: "ലോഗ് ഔട്ട്",

      welcome: "സ്വാഗതം",
      start_exam: "പരീക്ഷ ആരംഭിക്കുക",
      view_exam: "പരീക്ഷ കാണുക",
      view_result: "ഫലം കാണുക",
      check_answers: "ഉത്തരങ്ങൾ പരിശോധിക്കുക",
      publish_results: "ഫലങ്ങൾ പ്രസിദ്ധീകരിക്കുക",

      upcoming: "വരാനിരിക്കുന്ന",
      active: "സജീവം",
      completed: "പൂർത്തിയായി",
      in_progress: "പുരോഗതിയിൽ",

      exam_name: "പരീക്ഷയുടെ പേര്",
      subject: "വിഷയം",
      duration: "ദൈർഘ്യം",
      maximum_marks: "പരമാവധി മാർക്ക്",
      total_questions: "ആകെ ചോദ്യങ്ങൾ",
      score: "സ്കോർ",
      correct: "ശരി",
      wrong: "തെറ്റ്",
      unanswered: "ഉത്തരം നൽകാത്തത്",

      loading: "ലോഡ് ചെയ്യുന്നു...",
      save: "സംരക്ഷിക്കുക",
      cancel: "റദ്ദാക്കുക",
      back: "തിരികെ",
      next: "അടുത്തത്",
      previous: "മുമ്പത്തെ",
      submit: "സമർപ്പിക്കുക",
      search: "തിരയുക",

      no_exams: "പരീക്ഷകളൊന്നും ലഭ്യമല്ല.",
      no_submissions: "ഇതുവരെ ഒരു വിദ്യാർത്ഥിയും ഈ പരീക്ഷ സമർപ്പിച്ചിട്ടില്ല.",
      result_not_published: "ഫലം ഇതുവരെ പ്രസിദ്ധീകരിച്ചിട്ടില്ല.",

      camera_required: "പരീക്ഷ ആരംഭിക്കാൻ ക്യാമറ ആക്സസ് ആവശ്യമാണ്.",
      fullscreen_required: "പരീക്ഷയ്ക്കിടെ ഫുൾസ്ക്രീൻ മോഡ് ആവശ്യമാണ്.",
      accept_and_start: "അംഗീകരിച്ച് പരീക്ഷ ആരംഭിക്കുക",

      landing: {
  ai_powered_platform: "AI അധിഷ്ഠിത പരീക്ഷാ പ്ലാറ്റ്ഫോം",
  smarter_exams: "മികച്ച പരീക്ഷകൾ.",
  better_results: "മികച്ച ഫലങ്ങൾ.",
  faster_grading: "വേഗത്തിലുള്ള മൂല്യനിർണ്ണയം.",
  smarter_insights: "മികച്ച വിശകലനം.",
  hero_description:
    "വിദ്യാർത്ഥികൾക്കും പരീക്ഷകർക്കും അഡ്മിനിസ്ട്രേറ്റർമാർക്കുമായി രൂപകൽപ്പന ചെയ്ത സുരക്ഷിതവും ബുദ്ധിപരവുമായ പരീക്ഷാ പ്ലാറ്റ്ഫോം.",
  get_started: "ആരംഭിക്കുക",
  login: "ലോഗിൻ",
  user_roles: "ഉപയോക്തൃ റോളുകൾ",
  ai_powered: "AI അധിഷ്ഠിതം",
  available: "ലഭ്യമാണ്",

  ai_examination_platform: "AI പരീക്ഷാ പ്ലാറ്റ്ഫോം",
  dashboard: "ഡാഷ്ബോർഡ്",
  exams: "പരീക്ഷകൾ",
  results: "ഫലങ്ങൾ",
  settings: "ക്രമീകരണങ്ങൾ",
  welcome_back: "വീണ്ടും സ്വാഗതം",
  examination_overview: "നിങ്ങളുടെ പരീക്ഷാ അവലോകനം ഇവിടെ കാണാം",
  examinations: "പരീക്ഷകൾ",
  completed: "പൂർത്തിയായി",
  average_score: "ശരാശരി സ്കോർ",
  performance: "പ്രകടനം",
  this_month: "ഈ മാസം",

  trusted_institutions:
    "മുന്നോട്ട് ചിന്തിക്കുന്ന സ്ഥാപനങ്ങളുടെ വിശ്വാസം",
  university: "സർവകലാശാല",
  academy: "അക്കാദമി",
  institute: "സ്ഥാപനം",
  coaching: "കോച്ചിംഗ്",
  lab: "ലാബ്",

  platform_features: "പ്ലാറ്റ്ഫോം സവിശേഷതകൾ",
  everything_you_need: "ആധുനിക",
  modern_examinations: "പരീക്ഷകൾക്കാവശ്യമായ എല്ലാം",
  features_description:
    "പൂർണ്ണ പരീക്ഷാ പ്രക്രിയ ഒരൊറ്റ കേന്ദ്രീകൃത പ്ലാറ്റ്ഫോമിൽ നിയന്ത്രിക്കുക.",

  student_portal: "വിദ്യാർത്ഥി പോർട്ടൽ",
  student_portal_description:
    "പരീക്ഷകളിൽ പങ്കെടുക്കുക, ഉത്തരങ്ങൾ സമർപ്പിക്കുക, ഫലങ്ങൾ കാണുക.",

  examiner_portal: "പരീക്ഷക പോർട്ടൽ",
  examiner_portal_description:
    "പരീക്ഷകൾ സൃഷ്ടിക്കുക, ചോദ്യങ്ങൾ നിയന്ത്രിക്കുക, പ്രകടനം വിലയിരുത്തുക.",

  admin_control: "അഡ്മിൻ നിയന്ത്രണം",
  admin_control_description:
    "ഉപയോക്താക്കളെയും പരീക്ഷക അംഗീകാരങ്ങളെയും മുഴുവൻ പ്ലാറ്റ്ഫോമിനെയും നിയന്ത്രിക്കുക.",

  ai_powered_description:
    "ആധുനിക പരീക്ഷാ അനുഭവത്തിനായുള്ള ബുദ്ധിപരമായ സാങ്കേതികവിദ്യ.",

  how_it_works: "ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു",
  get_started_in: "ആരംഭിക്കുക",
  three_simple_steps: "3 ലളിതമായ ഘട്ടങ്ങളിൽ",

  register: "രജിസ്റ്റർ ചെയ്യുക",
  register_description:
    "വിദ്യാർത്ഥി, പരീക്ഷകൻ അല്ലെങ്കിൽ അഡ്മിനിസ്ട്രേറ്റർ എന്ന നിലയിൽ നിങ്ങളുടെ അക്കൗണ്ട് സൃഷ്ടിക്കുക.",

  attend_or_create: "പങ്കെടുക്കുക അല്ലെങ്കിൽ സൃഷ്ടിക്കുക",
  attend_or_create_description:
    "വിദ്യാർത്ഥികൾ പരീക്ഷകൾ എഴുതുന്നു. പരീക്ഷകർ പരീക്ഷകൾ സൃഷ്ടിക്കുകയും നിയന്ത്രിക്കുകയും ചെയ്യുന്നു.",

  get_results: "ഫലങ്ങൾ നേടുക",
  get_results_description:
    "തൽക്ഷണ ഫീഡ്ബാക്കും സ്കോറുകളും പ്രകടന വിശകലനവും നേടുക.",

  about_platform: "പ്ലാറ്റ്ഫോമിനെക്കുറിച്ച്",
  built_for_the: "വിദ്യാഭ്യാസത്തിന്റെ",
  future_of_education: "ഭാവിക്കായി നിർമ്മിച്ചത്",

  about_description_one:
    "AI പരീക്ഷാ പ്ലാറ്റ്ഫോം വിദ്യാർത്ഥികൾക്കും പരീക്ഷകർക്കും അഡ്മിനിസ്ട്രേറ്റർമാർക്കും ഒരു കേന്ദ്രീകൃത അന്തരീക്ഷം നൽകുന്നു.",

  about_description_two:
    "രജിസ്ട്രേഷനും പരീക്ഷാ മാനേജ്മെന്റും മുതൽ ഫലങ്ങളും അഡ്മിനിസ്ട്രേഷനും വരെ എല്ലാം സുരക്ഷിതമായ ഒരൊറ്റ പ്ലാറ്റ്ഫോമിൽ ക്രമീകരിച്ചിരിക്കുന്നു.",

  create_account: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",

  faq: "പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ",
  frequently_asked: "പതിവായി ചോദിക്കുന്ന",
  questions: "ചോദ്യങ്ങൾ",

  faq1_q: "ഈ പ്ലാറ്റ്ഫോം ആർക്കൊക്കെ ഉപയോഗിക്കാം?",
  faq1_a:
    "വിദ്യാർത്ഥികൾ, പരീക്ഷകർ, അഡ്മിനിസ്ട്രേറ്റർമാർ — ഓരോരുത്തർക്കും പ്രത്യേക റോൾ അടിസ്ഥാനമാക്കിയുള്ള ഡാഷ്ബോർഡ് ലഭ്യമാണ്.",

  faq2_q: "ഈ പ്ലാറ്റ്ഫോം AI അധിഷ്ഠിതമാണോ?",
  faq2_a:
    "അതെ. ചോദ്യങ്ങൾ സൃഷ്ടിക്കുന്നതിനും ഉത്തരങ്ങൾ വിലയിരുത്തുന്നതിനും പ്രകടനം വിശകലനം ചെയ്യുന്നതിനും AI സഹായിക്കുന്നു.",

  faq3_q: "പരീക്ഷകർക്ക് അഡ്മിൻ അംഗീകാരം ആവശ്യമാണോ?",
  faq3_a:
    "അതെ. പരീക്ഷകർ രജിസ്റ്റർ ചെയ്യുകയും പരീക്ഷകൾ സൃഷ്ടിക്കുന്നതിന് മുമ്പ് അഡ്മിൻ അംഗീകാരത്തിനായി കാത്തിരിക്കുകയും വേണം.",

  faq4_q: "വിദ്യാർത്ഥികൾക്ക് ഉടൻ ഫലങ്ങൾ കാണാൻ കഴിയുമോ?",
  faq4_a:
    "പരീക്ഷകൻ തന്റെ ഡാഷ്ബോർഡിൽ നിന്ന് ഫലങ്ങൾ പ്രസിദ്ധീകരിച്ച ശേഷം വിദ്യാർത്ഥികൾക്ക് അവ കാണാൻ കഴിയും.",

  ready_to_get_started: "ആരംഭിക്കാൻ തയ്യാറാണോ?",
  start_journey_today:
    "ഇന്ന് തന്നെ നിങ്ങളുടെ പരീക്ഷാ യാത്ര ആരംഭിക്കുക.",
},

nav: {
  features: "സവിശേഷതകൾ",
  about: "ഞങ്ങളെക്കുറിച്ച്",
  login: "ലോഗിൻ",
  register: "രജിസ്റ്റർ ചെയ്യുക",
},

footer: {
  platform: "AI പരീക്ഷാ പ്ലാറ്റ്ഫോം",
  copyright: "© 2026 AI പരീക്ഷാ പ്ലാറ്റ്ഫോം",
},

login: {
  smart_simple: "സ്മാർട്ടും ലളിതവുമായ പരീക്ഷാ പ്ലാറ്റ്ഫോം",
  welcome: "സ്വാഗതം",
  back: "തിരികെ.",
  description:
    "നിങ്ങളുടെ പരീക്ഷാ യാത്ര തുടരാനും ആവശ്യമായ എല്ലാം ഒരിടത്ത് ലഭ്യമാക്കാനും ലോഗിൻ ചെയ്യുക.",

  safe_secure: "സുരക്ഷിതവും സ്വകാര്യവും",
  safe_secure_description:
    "നിങ്ങളുടെ അക്കൗണ്ട് വിവരങ്ങൾ സുരക്ഷിതമായും സ്വകാര്യമായും സൂക്ഷിക്കുന്നു.",

  everything_one_place: "എല്ലാം ഒരിടത്ത്",
  everything_one_place_description:
    "നിങ്ങളുടെ പരീക്ഷകളും ഫലങ്ങളും പ്രവർത്തനങ്ങളും എളുപ്പത്തിൽ ആക്സസ് ചെയ്യുക.",

  easy_to_use: "ഉപയോഗിക്കാൻ എളുപ്പം",
  easy_to_use_description:
    "എല്ലാവർക്കുമായി രൂപകൽപ്പന ചെയ്ത ലളിതമായ അനുഭവം.",

  welcome_back: "വീണ്ടും സ്വാഗതം",
  sign_in_description:
    "നിങ്ങളുടെ അക്കൗണ്ടിലേക്ക് തുടരാൻ ലോഗിൻ ചെയ്യുക.",

  email: "ഇമെയിൽ വിലാസം",
  password: "പാസ്‌വേഡ്",
  password_placeholder: "നിങ്ങളുടെ പാസ്‌വേഡ് നൽകുക",

  remember_me: "എന്നെ ഓർമ്മിക്കുക",

  logging_in: "ലോഗിൻ ചെയ്യുന്നു...",
  sign_in: "ലോഗിൻ ചെയ്യുക",

  no_account: "അക്കൗണ്ട് ഇല്ലേ?",
  create_account: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",

  back_home: "ഹോമിലേക്ക് മടങ്ങുക",

  invalid_credentials: "അസാധുവായ ഇമെയിൽ അല്ലെങ്കിൽ പാസ്‌വേഡ്",
},

register: {
  smart_simple: "സ്മാർട്ടും ലളിതവുമായ പരീക്ഷാ പ്ലാറ്റ്ഫോം",
  start_your: "നിങ്ങളുടെ",
  examination_journey: "പരീക്ഷാ യാത്ര ആരംഭിക്കുക.",
  description:
    "നിങ്ങളുടെ അക്കൗണ്ട് സൃഷ്ടിച്ച് ലളിതവും സുരക്ഷിതവും സൗകര്യപ്രദവുമായ പരീക്ഷാ അനുഭവം നേടുക.",

  safe_secure: "സുരക്ഷിതവും സ്വകാര്യവും",
  safe_secure_description:
    "നിങ്ങളുടെ അക്കൗണ്ടും വ്യക്തിഗത വിവരങ്ങളും സുരക്ഷിതമായി സൂക്ഷിക്കുന്നു.",

  simple_examination: "ലളിതമായ പരീക്ഷ",
  simple_examination_description:
    "ഒരു സൗകര്യപ്രദമായ പ്ലാറ്റ്ഫോമിൽ നിന്ന് നിങ്ങളുടെ പരീക്ഷകൾ എളുപ്പത്തിൽ എഴുതുക.",

  track_progress: "നിങ്ങളുടെ പുരോഗതി നിരീക്ഷിക്കുക",
  track_progress_description:
    "നിങ്ങളുടെ ഫലങ്ങൾ കാണുകയും പരീക്ഷാ പ്രകടനം നിരീക്ഷിക്കുകയും ചെയ്യുക.",

  create_account: "നിങ്ങളുടെ അക്കൗണ്ട് സൃഷ്ടിക്കുക",
  join_platform:
    "പ്ലാറ്റ്ഫോമിൽ ചേരുകയും ഇന്നുതന്നെ ആരംഭിക്കുകയും ചെയ്യുക.",

  full_name: "പൂർണ്ണ പേര്",
  full_name_placeholder: "നിങ്ങളുടെ പൂർണ്ണ പേര് നൽകുക",

  email: "ഇമെയിൽ വിലാസം",

  register_as: "ഞാൻ രജിസ്റ്റർ ചെയ്യാൻ ആഗ്രഹിക്കുന്നത്",

  student: "വിദ്യാർത്ഥി",
  student_description: "പരീക്ഷകൾ എഴുതുക",

  examiner: "പരീക്ഷകൻ",
  examiner_description:
    "പരീക്ഷകൾ സൃഷ്ടിക്കുകയും നിയന്ത്രിക്കുകയും ചെയ്യുക",

  admin_approval: "അഡ്മിനിസ്ട്രേറ്ററുടെ അംഗീകാരം ആവശ്യമാണ്",
  admin_approval_description:
    "പരീക്ഷക അക്കൗണ്ട് ആക്സസ് ചെയ്യുന്നതിന് മുമ്പ് നിങ്ങളുടെ രജിസ്ട്രേഷൻ അഭ്യർത്ഥന അഡ്മിനിസ്ട്രേറ്റർ പരിശോധിക്കും.",

  password: "പാസ്‌വേഡ്",
  password_placeholder: "ഒരു പാസ്‌വേഡ് സൃഷ്ടിക്കുക",
  password_hint: "കുറഞ്ഞത് 6 അക്ഷരങ്ങൾ ഉപയോഗിക്കുക.",

  confirm_password: "പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക",
  confirm_password_placeholder:
    "നിങ്ങളുടെ പാസ്‌വേഡ് വീണ്ടും നൽകുക",

  creating_account: "അക്കൗണ്ട് സൃഷ്ടിക്കുന്നു...",
  submit_request: "അഭ്യർത്ഥന സമർപ്പിക്കുക",
  create_account_button: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",

  already_account: "ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?",
  sign_in: "ലോഗിൻ ചെയ്യുക",

  back_home: "ഹോമിലേക്ക് മടങ്ങുക",

  name_required: "നിങ്ങളുടെ പൂർണ്ണ പേര് നൽകുക.",
  email_required: "നിങ്ങളുടെ ഇമെയിൽ വിലാസം നൽകുക.",
  password_length:
    "നിങ്ങളുടെ പാസ്‌വേഡിൽ കുറഞ്ഞത് 6 അക്ഷരങ്ങൾ ഉണ്ടായിരിക്കണം.",
  password_mismatch:
    "നിങ്ങൾ നൽകിയ പാസ്‌വേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല.",

  create_account_error:
    "നിങ്ങളുടെ അക്കൗണ്ട് സൃഷ്ടിക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക.",

  connection_error:
    "നിങ്ങളുടെ അക്കൗണ്ട് സൃഷ്ടിക്കാൻ കഴിഞ്ഞില്ല. നിങ്ങളുടെ കണക്ഷൻ പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കുക.",

  examiner_success:
    "നിങ്ങളുടെ അഭ്യർത്ഥന വിജയകരമായി സമർപ്പിച്ചു. അഡ്മിനിസ്ട്രേറ്റർ നിങ്ങളുടെ അഭ്യർത്ഥന പരിശോധിക്കും.",

  student_success:
    "നിങ്ങളുടെ അക്കൗണ്ട് വിജയകരമായി സൃഷ്ടിച്ചു! നിങ്ങളെ ലോഗിൻ പേജിലേക്ക് കൊണ്ടുപോകുന്നു...",
},

admin: {
  role: "അഡ്മിനിസ്ട്രേറ്റർ",
  logout: "ലോഗൗട്ട്",
  toggle_menu: "മെനു മാറ്റുക",

  nav: {
    dashboard: "ഡാഷ്ബോർഡ്",
    users: "ഉപയോക്താക്കൾ",
    examinations: "പരീക്ഷകൾ",
    examiner_requests: "പരീക്ഷക അഭ്യർത്ഥനകൾ",
  },

  login_required: "അഡ്മിൻ ലോഗിൻ ആവശ്യമാണ്.",
  stats_error:
    "ഡാഷ്ബോർഡ് സ്ഥിതിവിവരക്കണക്കുകൾ ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല.",
  examiner_requests_error:
    "പരീക്ഷക അഭ്യർത്ഥനകൾ ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല.",

  approve_error:
    "പരീക്ഷകനെ അംഗീകരിക്കാൻ കഴിഞ്ഞില്ല.",
  reject_error:
    "പരീക്ഷകനെ നിരസിക്കാൻ കഴിഞ്ഞില്ല.",

  examiner_approved:
    "പരീക്ഷകനെ വിജയകരമായി അംഗീകരിച്ചു.",
  examiner_rejected:
    "പരീക്ഷകനെ നിരസിച്ചു.",

  loading_dashboard:
    "അഡ്മിൻ ഡാഷ്ബോർഡ് ലോഡ് ചെയ്യുന്നു...",

  administration: "അഡ്മിനിസ്ട്രേഷൻ",
  dashboard_title: "അഡ്മിൻ ഡാഷ്ബോർഡ്",
  dashboard_subtitle:
    "ഉപയോക്താക്കളെയും പരീക്ഷകളെയും പ്ലാറ്റ്ഫോം പ്രവർത്തനങ്ങളെയും ഒരിടത്ത് നിന്ന് നിയന്ത്രിക്കുക.",

  refresh: "പുതുക്കുക",

  total_students: "ആകെ വിദ്യാർത്ഥികൾ",
  total_examiners: "ആകെ പരീക്ഷകർ",
  pending_requests: "തീർപ്പാക്കാത്ത അഭ്യർത്ഥനകൾ",
  total_examinations: "ആകെ പരീക്ഷകൾ",

  management: "മാനേജ്മെന്റ്",
  quick_actions: "ദ്രുത പ്രവർത്തനങ്ങൾ",
  quick_actions_description:
    "പ്രധാന അഡ്മിനിസ്ട്രേഷൻ മേഖലകൾ ആക്സസ് ചെയ്യുക.",

  manage_users: "ഉപയോക്താക്കളെ നിയന്ത്രിക്കുക",
  manage_users_description:
    "വിദ്യാർത്ഥികളെയും പരീക്ഷകരെയും അഡ്മിനിസ്ട്രേറ്റർമാരെയും കാണുക.",

  examiner_requests: "പരീക്ഷക അഭ്യർത്ഥനകൾ",
  examiner_requests_description:
    "തീർപ്പാക്കാത്ത പരീക്ഷക രജിസ്ട്രേഷനുകൾ പരിശോധിക്കുക.",

  examination_management: "പരീക്ഷാ മാനേജ്മെന്റ്",
  examination_management_description:
    "പരീക്ഷകൾ, ഷെഡ്യൂളുകൾ, വിദ്യാർത്ഥി പ്രവർത്തനങ്ങൾ എന്നിവ നിരീക്ഷിക്കുക.",

  platform: "പ്ലാറ്റ്ഫോം",
  system_overview: "സിസ്റ്റം അവലോകനം",

  users: "ഉപയോക്താക്കൾ",
  students: "വിദ്യാർത്ഥികൾ",
  examiners: "പരീക്ഷകർ",
  approved_examiners: "അംഗീകരിച്ച പരീക്ഷകർ",

  examinations: "പരീക്ഷകൾ",
  total_exams: "ആകെ പരീക്ഷകൾ",
  published: "പ്രസിദ്ധീകരിച്ചത്",
  unpublished: "പ്രസിദ്ധീകരിക്കാത്തത്",

  examination_activity: "പരീക്ഷാ പ്രവർത്തനം",
  total_attempts: "ആകെ ശ്രമങ്ങൾ",
  submitted: "സമർപ്പിച്ചത്",
  in_progress: "പുരോഗതിയിൽ",

  user_management: "ഉപയോക്തൃ മാനേജ്മെന്റ്",
  examiner_registration_requests:
    "പരീക്ഷക രജിസ്ട്രേഷൻ അഭ്യർത്ഥനകൾ",
  examiner_registration_description:
    "പരീക്ഷക രജിസ്ട്രേഷൻ അഭ്യർത്ഥനകൾ പരിശോധിക്കുകയും നിയന്ത്രിക്കുകയും ചെയ്യുക.",

  pending: "തീർപ്പാക്കാത്തത്",
  loading_examiner_requests:
    "പരീക്ഷക അഭ്യർത്ഥനകൾ ലോഡ് ചെയ്യുന്നു...",

  no_pending_requests:
    "തീർപ്പാക്കാത്ത അഭ്യർത്ഥനകളില്ല",
  no_pending_requests_description:
    "നിലവിൽ പരിശോധനയ്ക്കായി പരീക്ഷക രജിസ്ട്രേഷൻ അഭ്യർത്ഥനകളൊന്നുമില്ല.",

  pending_review: "പരിശോധന തീർപ്പാക്കാത്തത്",

  approve: "അംഗീകരിക്കുക",
  reject: "നിരസിക്കുക",
},

    },
  },

  kn: {
    translation: {
      language: "ಭಾಷೆ",
      english: "ಇಂಗ್ಲಿಷ್",
      hindi: "ಹಿಂದಿ",
      marathi: "ಮರಾಠಿ",
      tamil: "ತಮಿಳು",
      malayalam: "ಮಲಯಾಳಂ",
      kannada: "ಕನ್ನಡ",
      telugu: "ತೆಲುಗು",

      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      student_portal: "ವಿದ್ಯಾರ್ಥಿ ಪೋರ್ಟಲ್",
      examiner_portal: "ಪರೀಕ್ಷಕರ ಪೋರ್ಟಲ್",
      admin_portal: "ನಿರ್ವಾಹಕ ಪೋರ್ಟಲ್",

      home: "ಮುಖಪುಟ",
      exams: "ಪರೀಕ್ಷೆಗಳು",
      results: "ಫಲಿತಾಂಶಗಳು",
      submissions: "ಸಲ್ಲಿಕೆಗಳು",
      questions: "ಪ್ರಶ್ನೆಗಳು",
      profile: "ಪ್ರೊಫೈಲ್",
      settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      logout: "ಲಾಗ್ ಔಟ್",

      welcome: "ಸ್ವಾಗತ",
      start_exam: "ಪರೀಕ್ಷೆ ಪ್ರಾರಂಭಿಸಿ",
      view_exam: "ಪರೀಕ್ಷೆ ವೀಕ್ಷಿಸಿ",
      view_result: "ಫಲಿತಾಂಶ ವೀಕ್ಷಿಸಿ",
      check_answers: "ಉತ್ತರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
      publish_results: "ಫಲಿತಾಂಶಗಳನ್ನು ಪ್ರಕಟಿಸಿ",

      upcoming: "ಮುಂಬರುವ",
      active: "ಸಕ್ರಿಯ",
      completed: "ಪೂರ್ಣಗೊಂಡಿದೆ",
      in_progress: "ಪ್ರಗತಿಯಲ್ಲಿದೆ",

      exam_name: "ಪರೀಕ್ಷೆಯ ಹೆಸರು",
      subject: "ವಿಷಯ",
      duration: "ಅವಧಿ",
      maximum_marks: "ಗರಿಷ್ಠ ಅಂಕಗಳು",
      total_questions: "ಒಟ್ಟು ಪ್ರಶ್ನೆಗಳು",
      score: "ಅಂಕ",
      correct: "ಸರಿಯಾದ",
      wrong: "ತಪ್ಪಾದ",
      unanswered: "ಉತ್ತರಿಸದ",

      loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
      save: "ಉಳಿಸಿ",
      cancel: "ರದ್ದುಮಾಡಿ",
      back: "ಹಿಂದೆ",
      next: "ಮುಂದೆ",
      previous: "ಹಿಂದಿನ",
      submit: "ಸಲ್ಲಿಸಿ",
      search: "ಹುಡುಕಿ",

      no_exams: "ಯಾವುದೇ ಪರೀಕ್ಷೆಗಳು ಲಭ್ಯವಿಲ್ಲ.",
      no_submissions: "ಇನ್ನೂ ಯಾವುದೇ ವಿದ್ಯಾರ್ಥಿ ಈ ಪರೀಕ್ಷೆಯನ್ನು ಸಲ್ಲಿಸಿಲ್ಲ.",
      result_not_published: "ಫಲಿತಾಂಶವನ್ನು ಇನ್ನೂ ಪ್ರಕಟಿಸಲಾಗಿಲ್ಲ.",

      camera_required: "ಪರೀಕ್ಷೆಯನ್ನು ಪ್ರಾರಂಭಿಸಲು ಕ್ಯಾಮೆರಾ ಪ್ರವೇಶ ಅಗತ್ಯವಿದೆ.",
      fullscreen_required: "ಪರೀಕ್ಷೆಯ ಸಮಯದಲ್ಲಿ ಪೂರ್ಣ ಪರದೆ ಮೋಡ್ ಅಗತ್ಯವಿದೆ.",
      accept_and_start: "ಒಪ್ಪಿಕೊಂಡು ಪರೀಕ್ಷೆ ಪ್ರಾರಂಭಿಸಿ",

      landing: {
  ai_powered_platform: "AI ಚಾಲಿತ ಪರೀಕ್ಷಾ ವೇದಿಕೆ",
  smarter_exams: "ಸ್ಮಾರ್ಟ್ ಪರೀಕ್ಷೆಗಳು.",
  better_results: "ಉತ್ತಮ ಫಲಿತಾಂಶಗಳು.",
  faster_grading: "ವೇಗವಾದ ಮೌಲ್ಯಮಾಪನ.",
  smarter_insights: "ಸ್ಮಾರ್ಟ್ ವಿಶ್ಲೇಷಣೆ.",
  hero_description:
    "ವಿದ್ಯಾರ್ಥಿಗಳು, ಪರೀಕ್ಷಕರು ಮತ್ತು ನಿರ್ವಾಹಕರಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಸುರಕ್ಷಿತ ಮತ್ತು ಬುದ್ಧಿವಂತ ಪರೀಕ್ಷಾ ವೇದಿಕೆ.",
  get_started: "ಪ್ರಾರಂಭಿಸಿ",
  login: "ಲಾಗಿನ್",
  user_roles: "ಬಳಕೆದಾರರ ಪಾತ್ರಗಳು",
  ai_powered: "AI ಚಾಲಿತ",
  available: "ಲಭ್ಯವಿದೆ",

  ai_examination_platform: "AI ಪರೀಕ್ಷಾ ವೇದಿಕೆ",
  dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  exams: "ಪರೀಕ್ಷೆಗಳು",
  results: "ಫಲಿತಾಂಶಗಳು",
  settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
  welcome_back: "ಮತ್ತೆ ಸ್ವಾಗತ",
  examination_overview: "ನಿಮ್ಮ ಪರೀಕ್ಷೆಯ ಅವಲೋಕನ ಇಲ್ಲಿದೆ",
  examinations: "ಪರೀಕ್ಷೆಗಳು",
  completed: "ಪೂರ್ಣಗೊಂಡಿದೆ",
  average_score: "ಸರಾಸರಿ ಅಂಕ",
  performance: "ಕಾರ್ಯಕ್ಷಮತೆ",
  this_month: "ಈ ತಿಂಗಳು",

  trusted_institutions:
    "ಮುಂದಾಲೋಚನೆಯ ಸಂಸ್ಥೆಗಳಿಂದ ವಿಶ್ವಾಸಾರ್ಹ",
  university: "ವಿಶ್ವವಿದ್ಯಾಲಯ",
  academy: "ಅಕಾಡೆಮಿ",
  institute: "ಸಂಸ್ಥೆ",
  coaching: "ಕೋಚಿಂಗ್",
  lab: "ಪ್ರಯೋಗಾಲಯ",

  platform_features: "ವೇದಿಕೆಯ ವೈಶಿಷ್ಟ್ಯಗಳು",
  everything_you_need: "ಆಧುನಿಕ",
  modern_examinations: "ಪರೀಕ್ಷೆಗಳಿಗೆ ಬೇಕಾದ ಎಲ್ಲವೂ",
  features_description:
    "ಸಂಪೂರ್ಣ ಪರೀಕ್ಷಾ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಒಂದೇ ಕೇಂದ್ರೀಕೃತ ವೇದಿಕೆಯಿಂದ ನಿರ್ವಹಿಸಿ.",

  student_portal: "ವಿದ್ಯಾರ್ಥಿ ಪೋರ್ಟಲ್",
  student_portal_description:
    "ಪರೀಕ್ಷೆಗಳಲ್ಲಿ ಭಾಗವಹಿಸಿ, ಉತ್ತರಗಳನ್ನು ಸಲ್ಲಿಸಿ ಮತ್ತು ಫಲಿತಾಂಶಗಳನ್ನು ವೀಕ್ಷಿಸಿ.",

  examiner_portal: "ಪರೀಕ್ಷಕ ಪೋರ್ಟಲ್",
  examiner_portal_description:
    "ಪರೀಕ್ಷೆಗಳನ್ನು ರಚಿಸಿ, ಪ್ರಶ್ನೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ಕಾರ್ಯಕ್ಷಮತೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ.",

  admin_control: "ನಿರ್ವಾಹಕ ನಿಯಂತ್ರಣ",
  admin_control_description:
    "ಬಳಕೆದಾರರು, ಪರೀಕ್ಷಕರ ಅನುಮೋದನೆಗಳು ಮತ್ತು ಸಂಪೂರ್ಣ ವೇದಿಕೆಯನ್ನು ನಿರ್ವಹಿಸಿ.",

  ai_powered_description:
    "ಆಧುನಿಕ ಪರೀಕ್ಷಾ ಅನುಭವಕ್ಕಾಗಿ ಬುದ್ಧಿವಂತ ತಂತ್ರಜ್ಞಾನ.",

  how_it_works: "ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
  get_started_in: "ಪ್ರಾರಂಭಿಸಿ",
  three_simple_steps: "3 ಸರಳ ಹಂತಗಳಲ್ಲಿ",

  register: "ನೋಂದಾಯಿಸಿ",
  register_description:
    "ವಿದ್ಯಾರ್ಥಿ, ಪರೀಕ್ಷಕ ಅಥವಾ ನಿರ್ವಾಹಕರಾಗಿ ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ.",

  attend_or_create: "ಭಾಗವಹಿಸಿ ಅಥವಾ ರಚಿಸಿ",
  attend_or_create_description:
    "ವಿದ್ಯಾರ್ಥಿಗಳು ಪರೀಕ್ಷೆಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಾರೆ. ಪರೀಕ್ಷಕರು ಪರೀಕ್ಷೆಗಳನ್ನು ರಚಿಸಿ ನಿರ್ವಹಿಸುತ್ತಾರೆ.",

  get_results: "ಫಲಿತಾಂಶಗಳನ್ನು ಪಡೆಯಿರಿ",
  get_results_description:
    "ತಕ್ಷಣದ ಪ್ರತಿಕ್ರಿಯೆ, ಅಂಕಗಳು ಮತ್ತು ಕಾರ್ಯಕ್ಷಮತೆಯ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪಡೆಯಿರಿ.",

  about_platform: "ವೇದಿಕೆಯ ಬಗ್ಗೆ",
  built_for_the: "ಶಿಕ್ಷಣದ",
  future_of_education: "ಭವಿಷ್ಯಕ್ಕಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ",

  about_description_one:
    "AI ಪರೀಕ್ಷಾ ವೇದಿಕೆಯು ವಿದ್ಯಾರ್ಥಿಗಳು, ಪರೀಕ್ಷಕರು ಮತ್ತು ನಿರ್ವಾಹಕರಿಗೆ ಕೇಂದ್ರೀಕೃತ ಪರಿಸರವನ್ನು ಒದಗಿಸುತ್ತದೆ.",

  about_description_two:
    "ನೋಂದಣಿ ಮತ್ತು ಪರೀಕ್ಷಾ ನಿರ್ವಹಣೆಯಿಂದ ಫಲಿತಾಂಶಗಳು ಮತ್ತು ಆಡಳಿತದವರೆಗೆ ಎಲ್ಲವನ್ನೂ ಒಂದೇ ಸುರಕ್ಷಿತ ವೇದಿಕೆಯಲ್ಲಿ ವ್ಯವಸ್ಥೆಗೊಳಿಸಲಾಗಿದೆ.",

  create_account: "ಖಾತೆ ರಚಿಸಿ",

  faq: "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು",
  frequently_asked: "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ",
  questions: "ಪ್ರಶ್ನೆಗಳು",

  faq1_q: "ಈ ವೇದಿಕೆಯನ್ನು ಯಾರು ಬಳಸಬಹುದು?",
  faq1_a:
    "ವಿದ್ಯಾರ್ಥಿಗಳು, ಪರೀಕ್ಷಕರು ಮತ್ತು ನಿರ್ವಾಹಕರು — ಪ್ರತಿಯೊಬ್ಬರಿಗೂ ಪ್ರತ್ಯೇಕ ಪಾತ್ರ ಆಧಾರಿತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಇದೆ.",

  faq2_q: "ಈ ವೇದಿಕೆಯು AI ಚಾಲಿತವೇ?",
  faq2_a:
    "ಹೌದು. ಪ್ರಶ್ನೆಗಳನ್ನು ರಚಿಸುವುದು, ಉತ್ತರಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುವುದು ಮತ್ತು ಕಾರ್ಯಕ್ಷಮತೆಯನ್ನು ವಿಶ್ಲೇಷಿಸುವುದರಲ್ಲಿ AI ಸಹಾಯ ಮಾಡುತ್ತದೆ.",

  faq3_q: "ಪರೀಕ್ಷಕರಿಗೆ ನಿರ್ವಾಹಕರ ಅನುಮೋದನೆ ಅಗತ್ಯವಿದೆಯೇ?",
  faq3_a:
    "ಹೌದು. ಪರೀಕ್ಷಕರು ನೋಂದಾಯಿಸಿಕೊಂಡು ಪರೀಕ್ಷೆಗಳನ್ನು ರಚಿಸುವ ಮೊದಲು ನಿರ್ವಾಹಕರ ಅನುಮೋದನೆಗಾಗಿ ಕಾಯಬೇಕು.",

  faq4_q: "ವಿದ್ಯಾರ್ಥಿಗಳು ತಕ್ಷಣ ಫಲಿತಾಂಶಗಳನ್ನು ನೋಡಬಹುದೇ?",
  faq4_a:
    "ಪರೀಕ್ಷಕರು ತಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಿಂದ ಫಲಿತಾಂಶಗಳನ್ನು ಪ್ರಕಟಿಸಿದ ನಂತರ ವಿದ್ಯಾರ್ಥಿಗಳು ಅವುಗಳನ್ನು ವೀಕ್ಷಿಸಬಹುದು.",

  ready_to_get_started: "ಪ್ರಾರಂಭಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
  start_journey_today:
    "ಇಂದೇ ನಿಮ್ಮ ಪರೀಕ್ಷಾ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಿ.",
},

nav: {
  features: "ವೈಶಿಷ್ಟ್ಯಗಳು",
  about: "ನಮ್ಮ ಬಗ್ಗೆ",
  login: "ಲಾಗಿನ್",
  register: "ನೋಂದಣಿ",
},

footer: {
  platform: "AI ಪರೀಕ್ಷಾ ವೇದಿಕೆ",
  copyright: "© 2026 AI ಪರೀಕ್ಷಾ ವೇದಿಕೆ",
},

login: {
  smart_simple: "ಸ್ಮಾರ್ಟ್ ಮತ್ತು ಸರಳ ಪರೀಕ್ಷಾ ವೇದಿಕೆ",
  welcome: "ಸ್ವಾಗತ",
  back: "ಮತ್ತೆ.",
  description:
    "ನಿಮ್ಮ ಪರೀಕ್ಷಾ ಪ್ರಯಾಣವನ್ನು ಮುಂದುವರಿಸಲು ಮತ್ತು ಅಗತ್ಯವಿರುವ ಎಲ್ಲವನ್ನೂ ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ಪ್ರವೇಶಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ.",

  safe_secure: "ಸುರಕ್ಷಿತ ಮತ್ತು ಖಾಸಗಿ",
  safe_secure_description:
    "ನಿಮ್ಮ ಖಾತೆಯ ಮಾಹಿತಿಯನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಮತ್ತು ಖಾಸಗಿಯಾಗಿ ಇರಿಸಲಾಗುತ್ತದೆ.",

  everything_one_place: "ಎಲ್ಲವೂ ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ",
  everything_one_place_description:
    "ನಿಮ್ಮ ಪರೀಕ್ಷೆಗಳು, ಫಲಿತಾಂಶಗಳು ಮತ್ತು ಚಟುವಟಿಕೆಗಳನ್ನು ಸುಲಭವಾಗಿ ಪ್ರವೇಶಿಸಿ.",

  easy_to_use: "ಬಳಸಲು ಸುಲಭ",
  easy_to_use_description:
    "ಎಲ್ಲರಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಸರಳ ಅನುಭವ.",

  welcome_back: "ಮತ್ತೆ ಸ್ವಾಗತ",
  sign_in_description:
    "ನಿಮ್ಮ ಖಾತೆಗೆ ಮುಂದುವರಿಯಲು ಸೈನ್ ಇನ್ ಮಾಡಿ.",

  email: "ಇಮೇಲ್ ವಿಳಾಸ",
  password: "ಪಾಸ್‌ವರ್ಡ್",
  password_placeholder: "ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",

  remember_me: "ನನ್ನನ್ನು ನೆನಪಿನಲ್ಲಿಡಿ",

  logging_in: "ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...",
  sign_in: "ಸೈನ್ ಇನ್ ಮಾಡಿ",

  no_account: "ಖಾತೆ ಇಲ್ಲವೇ?",
  create_account: "ಖಾತೆ ರಚಿಸಿ",

  back_home: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",

  invalid_credentials: "ಅಮಾನ್ಯ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್",
},
register: {
  smart_simple: "ಸ್ಮಾರ್ಟ್ ಮತ್ತು ಸರಳ ಪರೀಕ್ಷಾ ವೇದಿಕೆ",
  start_your: "ನಿಮ್ಮ",
  examination_journey: "ಪರೀಕ್ಷಾ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಿ.",
  description:
    "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ ಮತ್ತು ಸರಳ, ಸುರಕ್ಷಿತ ಹಾಗೂ ಅನುಕೂಲಕರ ಪರೀಕ್ಷಾ ಅನುಭವವನ್ನು ಪಡೆಯಿರಿ.",

  safe_secure: "ಸುರಕ್ಷಿತ ಮತ್ತು ಖಾಸಗಿ",
  safe_secure_description:
    "ನಿಮ್ಮ ಖಾತೆ ಮತ್ತು ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಇರಿಸಲಾಗುತ್ತದೆ.",

  simple_examination: "ಸರಳ ಪರೀಕ್ಷೆ",
  simple_examination_description:
    "ಒಂದೇ ಅನುಕೂಲಕರ ವೇದಿಕೆಯಿಂದ ನಿಮ್ಮ ಪರೀಕ್ಷೆಗಳನ್ನು ಸುಲಭವಾಗಿ ತೆಗೆದುಕೊಳ್ಳಿ.",

  track_progress: "ನಿಮ್ಮ ಪ್ರಗತಿಯನ್ನು ಗಮನಿಸಿ",
  track_progress_description:
    "ನಿಮ್ಮ ಫಲಿತಾಂಶಗಳನ್ನು ವೀಕ್ಷಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಪರೀಕ್ಷಾ ಕಾರ್ಯಕ್ಷಮತೆಯನ್ನು ಗಮನಿಸಿ.",

  create_account: "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ",
  join_platform:
    "ವೇದಿಕೆಗೆ ಸೇರಿ ಮತ್ತು ಇಂದೇ ಪ್ರಾರಂಭಿಸಿ.",

  full_name: "ಪೂರ್ಣ ಹೆಸರು",
  full_name_placeholder: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",

  email: "ಇಮೇಲ್ ವಿಳಾಸ",

  register_as: "ನಾನು ಈ ರೀತಿಯಲ್ಲಿ ನೋಂದಾಯಿಸಲು ಬಯಸುತ್ತೇನೆ",

  student: "ವಿದ್ಯಾರ್ಥಿ",
  student_description: "ಪರೀಕ್ಷೆಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ",

  examiner: "ಪರೀಕ್ಷಕ",
  examiner_description:
    "ಪರೀಕ್ಷೆಗಳನ್ನು ರಚಿಸಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ",

  admin_approval: "ನಿರ್ವಾಹಕರ ಅನುಮೋದನೆ ಅಗತ್ಯವಿದೆ",
  admin_approval_description:
    "ಪರೀಕ್ಷಕರ ಖಾತೆಯನ್ನು ಪ್ರವೇಶಿಸುವ ಮೊದಲು ನಿಮ್ಮ ನೋಂದಣಿ ವಿನಂತಿಯನ್ನು ನಿರ್ವಾಹಕರು ಪರಿಶೀಲಿಸುತ್ತಾರೆ.",

  password: "ಪಾಸ್‌ವರ್ಡ್",
  password_placeholder: "ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ",
  password_hint: "ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳನ್ನು ಬಳಸಿ.",

  confirm_password: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
  confirm_password_placeholder:
    "ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಮತ್ತೆ ನಮೂದಿಸಿ",

  creating_account: "ಖಾತೆಯನ್ನು ರಚಿಸಲಾಗುತ್ತಿದೆ...",
  submit_request: "ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಿ",
  create_account_button: "ಖಾತೆ ರಚಿಸಿ",

  already_account: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",
  sign_in: "ಸೈನ್ ಇನ್ ಮಾಡಿ",

  back_home: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",

  name_required: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.",
  email_required: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ.",
  password_length:
    "ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು.",
  password_mismatch:
    "ನೀವು ನಮೂದಿಸಿದ ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.",

  create_account_error:
    "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",

  connection_error:
    "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ನಿಮ್ಮ ಸಂಪರ್ಕವನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",

  examiner_success:
    "ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ. ನಿರ್ವಾಹಕರು ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಪರಿಶೀಲಿಸುತ್ತಾರೆ.",

  student_success:
    "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ! ನಿಮ್ಮನ್ನು ಲಾಗಿನ್ ಪುಟಕ್ಕೆ ಕರೆದೊಯ್ಯಲಾಗುತ್ತಿದೆ...",
},

admin: {
  role: "ನಿರ್ವಾಹಕರು",
  logout: "ಲಾಗ್‌ಔಟ್",
  toggle_menu: "ಮೆನು ಬದಲಿಸಿ",

  nav: {
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    users: "ಬಳಕೆದಾರರು",
    examinations: "ಪರೀಕ್ಷೆಗಳು",
    examiner_requests: "ಪರೀಕ್ಷಕರ ವಿನಂತಿಗಳು",
  },

  login_required: "ನಿರ್ವಾಹಕರ ಲಾಗಿನ್ ಅಗತ್ಯವಿದೆ.",
  stats_error:
    "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಅಂಕಿಅಂಶಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
  examiner_requests_error:
    "ಪರೀಕ್ಷಕರ ವಿನಂತಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",

  approve_error:
    "ಪರೀಕ್ಷಕರನ್ನು ಅನುಮೋದಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
  reject_error:
    "ಪರೀಕ್ಷಕರನ್ನು ತಿರಸ್ಕರಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",

  examiner_approved:
    "ಪರೀಕ್ಷಕರನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅನುಮೋದಿಸಲಾಗಿದೆ.",
  examiner_rejected:
    "ಪರೀಕ್ಷಕರನ್ನು ತಿರಸ್ಕರಿಸಲಾಗಿದೆ.",

  loading_dashboard:
    "ನಿರ್ವಾಹಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",

  administration: "ನಿರ್ವಹಣೆ",
  dashboard_title: "ನಿರ್ವಾಹಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  dashboard_subtitle:
    "ಬಳಕೆದಾರರು, ಪರೀಕ್ಷೆಗಳು ಮತ್ತು ವೇದಿಕೆಯ ಚಟುವಟಿಕೆಗಳನ್ನು ಒಂದೇ ಸ್ಥಳದಿಂದ ನಿರ್ವಹಿಸಿ.",

  refresh: "ರಿಫ್ರೆಶ್",

  total_students: "ಒಟ್ಟು ವಿದ್ಯಾರ್ಥಿಗಳು",
  total_examiners: "ಒಟ್ಟು ಪರೀಕ್ಷಕರು",
  pending_requests: "ಬಾಕಿ ಇರುವ ವಿನಂತಿಗಳು",
  total_examinations: "ಒಟ್ಟು ಪರೀಕ್ಷೆಗಳು",

  management: "ನಿರ್ವಹಣೆ",
  quick_actions: "ತ್ವರಿತ ಕಾರ್ಯಗಳು",
  quick_actions_description:
    "ಮುಖ್ಯ ನಿರ್ವಹಣಾ ವಿಭಾಗಗಳನ್ನು ಪ್ರವೇಶಿಸಿ.",

  manage_users: "ಬಳಕೆದಾರರನ್ನು ನಿರ್ವಹಿಸಿ",
  manage_users_description:
    "ವಿದ್ಯಾರ್ಥಿಗಳು, ಪರೀಕ್ಷಕರು ಮತ್ತು ನಿರ್ವಾಹಕರನ್ನು ವೀಕ್ಷಿಸಿ.",

  examiner_requests: "ಪರೀಕ್ಷಕರ ವಿನಂತಿಗಳು",
  examiner_requests_description:
    "ಬಾಕಿ ಇರುವ ಪರೀಕ್ಷಕರ ನೋಂದಣಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",

  examination_management: "ಪರೀಕ್ಷಾ ನಿರ್ವಹಣೆ",
  examination_management_description:
    "ಪರೀಕ್ಷೆಗಳು, ವೇಳಾಪಟ್ಟಿಗಳು ಮತ್ತು ವಿದ್ಯಾರ್ಥಿ ಚಟುವಟಿಕೆಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.",

  platform: "ವೇದಿಕೆ",
  system_overview: "ಸಿಸ್ಟಮ್ ಅವಲೋಕನ",

  users: "ಬಳಕೆದಾರರು",
  students: "ವಿದ್ಯಾರ್ಥಿಗಳು",
  examiners: "ಪರೀಕ್ಷಕರು",
  approved_examiners: "ಅನುಮೋದಿತ ಪರೀಕ್ಷಕರು",

  examinations: "ಪರೀಕ್ಷೆಗಳು",
  total_exams: "ಒಟ್ಟು ಪರೀಕ್ಷೆಗಳು",
  published: "ಪ್ರಕಟಿಸಲಾಗಿದೆ",
  unpublished: "ಪ್ರಕಟಿಸಲಾಗಿಲ್ಲ",

  examination_activity: "ಪರೀಕ್ಷಾ ಚಟುವಟಿಕೆ",
  total_attempts: "ಒಟ್ಟು ಪ್ರಯತ್ನಗಳು",
  submitted: "ಸಲ್ಲಿಸಲಾಗಿದೆ",
  in_progress: "ಪ್ರಗತಿಯಲ್ಲಿದೆ",

  user_management: "ಬಳಕೆದಾರ ನಿರ್ವಹಣೆ",
  examiner_registration_requests:
    "ಪರೀಕ್ಷಕರ ನೋಂದಣಿ ವಿನಂತಿಗಳು",
  examiner_registration_description:
    "ಪರೀಕ್ಷಕರ ನೋಂದಣಿ ವಿನಂತಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ.",

  pending: "ಬಾಕಿ",
  loading_examiner_requests:
    "ಪರೀಕ್ಷಕರ ವಿನಂತಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",

  no_pending_requests:
    "ಯಾವುದೇ ಬಾಕಿ ವಿನಂತಿಗಳಿಲ್ಲ",
  no_pending_requests_description:
    "ಪ್ರಸ್ತುತ ಪರಿಶೀಲನೆಗಾಗಿ ಯಾವುದೇ ಪರೀಕ್ಷಕರ ನೋಂದಣಿ ವಿನಂತಿಗಳು ಇಲ್ಲ.",

  pending_review: "ಪರಿಶೀಲನೆ ಬಾಕಿ",

  approve: "ಅನುಮೋದಿಸಿ",
  reject: "ತಿರಸ್ಕರಿಸಿ",
},
    },
  },

  te: {
    translation: {
      language: "భాష",
      english: "ఇంగ్లీష్",
      hindi: "హిందీ",
      marathi: "మరాఠీ",
      tamil: "తమిళం",
      malayalam: "మలయాళం",
      kannada: "కన్నడ",
      telugu: "తెలుగు",

      dashboard: "డ్యాష్‌బోర్డ్",
      student_portal: "విద్యార్థి పోర్టల్",
      examiner_portal: "పరీక్షకుల పోర్టల్",
      admin_portal: "అడ్మిన్ పోర్టల్",

      home: "హోమ్",
      exams: "పరీక్షలు",
      results: "ఫలితాలు",
      submissions: "సమర్పణలు",
      questions: "ప్రశ్నలు",
      profile: "ప్రొఫైల్",
      settings: "సెట్టింగ్‌లు",
      logout: "లాగ్ అవుట్",

      welcome: "స్వాగతం",
      start_exam: "పరీక్ష ప్రారంభించండి",
      view_exam: "పరీక్షను చూడండి",
      view_result: "ఫలితాన్ని చూడండి",
      check_answers: "సమాధానాలను తనిఖీ చేయండి",
      publish_results: "ఫలితాలను ప్రచురించండి",

      upcoming: "రాబోయే",
      active: "యాక్టివ్",
      completed: "పూర్తయింది",
      in_progress: "కొనసాగుతోంది",

      exam_name: "పరీక్ష పేరు",
      subject: "విషయం",
      duration: "వ్యవధి",
      maximum_marks: "గరిష్ట మార్కులు",
      total_questions: "మొత్తం ప్రశ్నలు",
      score: "స్కోర్",
      correct: "సరైనవి",
      wrong: "తప్పైనవి",
      unanswered: "సమాధానం ఇవ్వనివి",

      loading: "లోడ్ అవుతోంది...",
      save: "సేవ్ చేయండి",
      cancel: "రద్దు చేయండి",
      back: "వెనక్కి",
      next: "తదుపరి",
      previous: "మునుపటి",
      submit: "సమర్పించండి",
      search: "వెతకండి",

      no_exams: "పరీక్షలు ఏవీ అందుబాటులో లేవు.",
      no_submissions: "ఇప్పటివరకు ఏ విద్యార్థి ఈ పరీక్షను సమర్పించలేదు.",
      result_not_published: "ఫలితం ఇంకా ప్రచురించబడలేదు.",

      camera_required: "పరీక్షను ప్రారంభించడానికి కెమెరా యాక్సెస్ అవసరం.",
      fullscreen_required: "పరీక్ష సమయంలో పూర్తి స్క్రీన్ మోడ్ అవసరం.",
      accept_and_start: "అంగీకరించి పరీక్ష ప్రారంభించండి",

      landing: {
  ai_powered_platform: "AI ఆధారిత పరీక్షా ప్లాట్‌ఫారమ్",
  smarter_exams: "స్మార్ట్ పరీక్షలు.",
  better_results: "మెరుగైన ఫలితాలు.",
  faster_grading: "వేగవంతమైన మూల్యాంకనం.",
  smarter_insights: "స్మార్ట్ విశ్లేషణ.",
  hero_description:
    "విద్యార్థులు, పరీక్షకులు మరియు నిర్వాహకుల కోసం రూపొందించబడిన సురక్షితమైన మరియు తెలివైన పరీక్షా ప్లాట్‌ఫారమ్.",
  get_started: "ప్రారంభించండి",
  login: "లాగిన్",
  user_roles: "వినియోగదారు పాత్రలు",
  ai_powered: "AI ఆధారితం",
  available: "అందుబాటులో ఉంది",

  ai_examination_platform: "AI పరీక్షా ప్లాట్‌ఫారమ్",
  dashboard: "డ్యాష్‌బోర్డ్",
  exams: "పరీక్షలు",
  results: "ఫలితాలు",
  settings: "సెట్టింగ్‌లు",
  welcome_back: "మళ్లీ స్వాగతం",
  examination_overview: "మీ పరీక్ష వివరాలు ఇక్కడ ఉన్నాయి",
  examinations: "పరీక్షలు",
  completed: "పూర్తయింది",
  average_score: "సగటు స్కోర్",
  performance: "పనితీరు",
  this_month: "ఈ నెల",

  trusted_institutions:
    "ముందుచూపు ఉన్న సంస్థల విశ్వాసం",
  university: "విశ్వవిద్యాలయం",
  academy: "అకాడమీ",
  institute: "సంస్థ",
  coaching: "కోచింగ్",
  lab: "ప్రయోగశాల",

  platform_features: "ప్లాట్‌ఫారమ్ ఫీచర్లు",
  everything_you_need: "ఆధునిక",
  modern_examinations: "పరీక్షలకు అవసరమైన ప్రతిదీ",
  features_description:
    "పూర్తి పరీక్షా ప్రక్రియను ఒకే కేంద్రీకృత ప్లాట్‌ఫారమ్ నుండి నిర్వహించండి.",

  student_portal: "విద్యార్థి పోర్టల్",
  student_portal_description:
    "పరీక్షల్లో పాల్గొని, సమాధానాలను సమర్పించి, ఫలితాలను చూడండి.",

  examiner_portal: "పరీక్షకుల పోర్టల్",
  examiner_portal_description:
    "పరీక్షలను సృష్టించి, ప్రశ్నలను నిర్వహించి, పనితీరును మూల్యాంకనం చేయండి.",

  admin_control: "అడ్మిన్ నియంత్రణ",
  admin_control_description:
    "వినియోగదారులు, పరీక్షకుల అనుమతులు మరియు మొత్తం ప్లాట్‌ఫారమ్‌ను నిర్వహించండి.",

  ai_powered_description:
    "ఆధునిక పరీక్షా అనుభవం కోసం తెలివైన సాంకేతికత.",

  how_it_works: "ఇది ఎలా పనిచేస్తుంది",
  get_started_in: "ప్రారంభించండి",
  three_simple_steps: "3 సులభమైన దశల్లో",

  register: "నమోదు చేసుకోండి",
  register_description:
    "విద్యార్థి, పరీక్షకుడు లేదా నిర్వాహకుడిగా మీ ఖాతాను సృష్టించండి.",

  attend_or_create: "పరీక్ష రాయండి లేదా సృష్టించండి",
  attend_or_create_description:
    "విద్యార్థులు పరీక్షలు రాస్తారు. పరీక్షకులు పరీక్షలను సృష్టించి నిర్వహిస్తారు.",

  get_results: "ఫలితాలను పొందండి",
  get_results_description:
    "తక్షణ ఫీడ్‌బ్యాక్, స్కోర్లు మరియు పనితీరు విశ్లేషణ పొందండి.",

  about_platform: "ప్లాట్‌ఫారమ్ గురించి",
  built_for_the: "విద్య యొక్క",
  future_of_education: "భవిష్యత్తు కోసం నిర్మించబడింది",

  about_description_one:
    "AI పరీక్షా ప్లాట్‌ఫారమ్ విద్యార్థులు, పరీక్షకులు మరియు నిర్వాహకులకు కేంద్రీకృత వాతావరణాన్ని అందిస్తుంది.",

  about_description_two:
    "నమోదు మరియు పరీక్షా నిర్వహణ నుండి ఫలితాలు మరియు పరిపాలన వరకు అన్నీ ఒకే సురక్షిత ప్లాట్‌ఫారమ్‌లో నిర్వహించబడతాయి.",

  create_account: "ఖాతాను సృష్టించండి",

  faq: "తరచుగా అడిగే ప్రశ్నలు",
  frequently_asked: "తరచుగా అడిగే",
  questions: "ప్రశ్నలు",

  faq1_q: "ఈ ప్లాట్‌ఫారమ్‌ను ఎవరు ఉపయోగించవచ్చు?",
  faq1_a:
    "విద్యార్థులు, పరీక్షకులు మరియు నిర్వాహకులు — ప్రతి ఒక్కరికీ ప్రత్యేక పాత్ర ఆధారిత డ్యాష్‌బోర్డ్ ఉంటుంది.",

  faq2_q: "ఈ ప్లాట్‌ఫారమ్ AI ఆధారితమా?",
  faq2_a:
    "అవును. ప్రశ్నలను రూపొందించడం, సమాధానాలను మూల్యాంకనం చేయడం మరియు పనితీరును విశ్లేషించడంలో AI సహాయపడుతుంది.",

  faq3_q: "పరీక్షకులకు అడ్మిన్ అనుమతి అవసరమా?",
  faq3_a:
    "అవును. పరీక్షకులు నమోదు చేసుకుని పరీక్షలను సృష్టించే ముందు అడ్మిన్ అనుమతి కోసం వేచి ఉండాలి.",

  faq4_q: "విద్యార్థులు వెంటనే ఫలితాలను చూడగలరా?",
  faq4_a:
    "పరీక్షకుడు తన డ్యాష్‌బోర్డ్ నుండి ఫలితాలను ప్రచురించిన తర్వాత విద్యార్థులు వాటిని చూడగలరు.",

  ready_to_get_started:
    "ప్రారంభించడానికి సిద్ధంగా ఉన్నారా?",

  start_journey_today:
    "ఈరోజే మీ పరీక్షా ప్రయాణాన్ని ప్రారంభించండి.",
},

nav: {
  features: "ఫీచర్లు",
  about: "మా గురించి",
  login: "లాగిన్",
  register: "నమోదు చేసుకోండి",
},

footer: {
  platform: "AI పరీక్షా ప్లాట్‌ఫారమ్",
  copyright: "© 2026 AI పరీక్షా ప్లాట్‌ఫారమ్",
},

login: {
  smart_simple: "స్మార్ట్ మరియు సులభమైన పరీక్షా ప్లాట్‌ఫారమ్",
  welcome: "స్వాగతం",
  back: "తిరిగి.",
  description:
    "మీ పరీక్షా ప్రయాణాన్ని కొనసాగించడానికి మరియు అవసరమైన ప్రతిదాన్ని ఒకే చోట యాక్సెస్ చేయడానికి సైన్ ఇన్ చేయండి.",

  safe_secure: "సురక్షితమైనది మరియు ప్రైవేట్",
  safe_secure_description:
    "మీ ఖాతా సమాచారం సురక్షితంగా మరియు ప్రైవేట్‌గా ఉంచబడుతుంది.",

  everything_one_place: "అన్నీ ఒకే చోట",
  everything_one_place_description:
    "మీ పరీక్షలు, ఫలితాలు మరియు కార్యకలాపాలను సులభంగా యాక్సెస్ చేయండి.",

  easy_to_use: "ఉపయోగించడానికి సులభం",
  easy_to_use_description:
    "అందరి కోసం రూపొందించబడిన సరళమైన అనుభవం.",

  welcome_back: "మళ్లీ స్వాగతం",
  sign_in_description:
    "మీ ఖాతాకు కొనసాగడానికి సైన్ ఇన్ చేయండి.",

  email: "ఇమెయిల్ చిరునామా",
  password: "పాస్‌వర్డ్",
  password_placeholder: "మీ పాస్‌వర్డ్‌ను నమోదు చేయండి",

  remember_me: "నన్ను గుర్తుంచుకోండి",

  logging_in: "లాగిన్ అవుతోంది...",
  sign_in: "సైన్ ఇన్ చేయండి",

  no_account: "ఖాతా లేదా?",
  create_account: "ఖాతాను సృష్టించండి",

  back_home: "హోమ్‌కు తిరిగి వెళ్ళండి",

  invalid_credentials: "చెల్లని ఇమెయిల్ లేదా పాస్‌వర్డ్",
},

register: {
  smart_simple: "స్మార్ట్ మరియు సులభమైన పరీక్షా ప్లాట్‌ఫారమ్",
  start_your: "మీ",
  examination_journey: "పరీక్షా ప్రయాణాన్ని ప్రారంభించండి.",
  description:
    "మీ ఖాతాను సృష్టించి సరళమైన, సురక్షితమైన మరియు సౌకర్యవంతమైన పరీక్షా అనుభవాన్ని పొందండి.",

  safe_secure: "సురక్షితమైనది",
  safe_secure_description:
    "మీ ఖాతా మరియు వ్యక్తిగత సమాచారం సురక్షితంగా ఉంచబడుతుంది.",

  simple_examination: "సులభమైన పరీక్ష",
  simple_examination_description:
    "ఒకే సౌకర్యవంతమైన ప్లాట్‌ఫారమ్ నుండి మీ పరీక్షలను సులభంగా రాయండి.",

  track_progress: "మీ పురోగతిని గమనించండి",
  track_progress_description:
    "మీ ఫలితాలను చూడండి మరియు మీ పరీక్షా పనితీరును గమనించండి.",

  create_account: "మీ ఖాతాను సృష్టించండి",
  join_platform:
    "ప్లాట్‌ఫారమ్‌లో చేరి ఈరోజే ప్రారంభించండి.",

  full_name: "పూర్తి పేరు",
  full_name_placeholder: "మీ పూర్తి పేరును నమోదు చేయండి",

  email: "ఇమెయిల్ చిరునామా",

  register_as: "నేను ఈ విధంగా నమోదు చేసుకోవాలనుకుంటున్నాను",

  student: "విద్యార్థి",
  student_description: "పరీక్షలు రాయండి",

  examiner: "పరీక్షకుడు",
  examiner_description:
    "పరీక్షలను సృష్టించి నిర్వహించండి",

  admin_approval: "అడ్మినిస్ట్రేటర్ అనుమతి అవసరం",
  admin_approval_description:
    "పరీక్షకుడి ఖాతాను యాక్సెస్ చేయడానికి ముందు మీ రిజిస్ట్రేషన్ అభ్యర్థనను అడ్మినిస్ట్రేటర్ సమీక్షిస్తారు.",

  password: "పాస్‌వర్డ్",
  password_placeholder: "పాస్‌వర్డ్‌ను సృష్టించండి",
  password_hint: "కనీసం 6 అక్షరాలను ఉపయోగించండి.",

  confirm_password: "పాస్‌వర్డ్‌ను నిర్ధారించండి",
  confirm_password_placeholder:
    "మీ పాస్‌వర్డ్‌ను మళ్లీ నమోదు చేయండి",

  creating_account: "ఖాతా సృష్టించబడుతోంది...",
  submit_request: "అభ్యర్థనను సమర్పించండి",
  create_account_button: "ఖాతాను సృష్టించండి",

  already_account: "ఇప్పటికే ఖాతా ఉందా?",
  sign_in: "సైన్ ఇన్ చేయండి",

  back_home: "హోమ్‌కు తిరిగి వెళ్లండి",

  name_required: "దయచేసి మీ పూర్తి పేరును నమోదు చేయండి.",
  email_required: "దయచేసి మీ ఇమెయిల్ చిరునామాను నమోదు చేయండి.",
  password_length:
    "మీ పాస్‌వర్డ్‌లో కనీసం 6 అక్షరాలు ఉండాలి.",
  password_mismatch:
    "మీరు నమోదు చేసిన పాస్‌వర్డ్‌లు సరిపోలడం లేదు.",

  create_account_error:
    "మీ ఖాతాను సృష్టించలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి.",

  connection_error:
    "మీ ఖాతాను సృష్టించలేకపోయాము. మీ కనెక్షన్‌ను తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.",

  examiner_success:
    "మీ అభ్యర్థన విజయవంతంగా సమర్పించబడింది. అడ్మినిస్ట్రేటర్ మీ అభ్యర్థనను సమీక్షిస్తారు.",

  student_success:
    "మీ ఖాతా విజయవంతంగా సృష్టించబడింది! మిమ్మల్ని లాగిన్ పేజీకి తీసుకెళ్తున్నాము...",
},

admin: {
  role: "అడ్మినిస్ట్రేటర్",
  logout: "లాగ్‌అవుట్",
  toggle_menu: "మెనూను మార్చండి",

  nav: {
    dashboard: "డాష్‌బోర్డ్",
    users: "వినియోగదారులు",
    examinations: "పరీక్షలు",
    examiner_requests: "పరీక్షకుల అభ్యర్థనలు",
  },

  login_required: "అడ్మిన్ లాగిన్ అవసరం.",
  stats_error:
    "డాష్‌బోర్డ్ గణాంకాలను లోడ్ చేయలేకపోయాము.",
  examiner_requests_error:
    "పరీక్షకుల అభ్యర్థనలను లోడ్ చేయలేకపోయాము.",

  approve_error:
    "పరీక్షకుడిని ఆమోదించలేకపోయాము.",
  reject_error:
    "పరీక్షకుడిని తిరస్కరించలేకపోయాము.",

  examiner_approved:
    "పరీక్షకుడు విజయవంతంగా ఆమోదించబడ్డారు.",
  examiner_rejected:
    "పరీక్షకుడు తిరస్కరించబడ్డారు.",

  loading_dashboard:
    "అడ్మిన్ డాష్‌బోర్డ్ లోడ్ అవుతోంది...",

  administration: "నిర్వహణ",
  dashboard_title: "అడ్మిన్ డాష్‌బోర్డ్",
  dashboard_subtitle:
    "వినియోగదారులు, పరీక్షలు మరియు ప్లాట్‌ఫారమ్ కార్యకలాపాలను ఒకే చోట నుండి నిర్వహించండి.",

  refresh: "రిఫ్రెష్",

  total_students: "మొత్తం విద్యార్థులు",
  total_examiners: "మొత్తం పరీక్షకులు",
  pending_requests: "పెండింగ్ అభ్యర్థనలు",
  total_examinations: "మొత్తం పరీక్షలు",

  management: "నిర్వహణ",
  quick_actions: "త్వరిత చర్యలు",
  quick_actions_description:
    "ప్రధాన పరిపాలనా విభాగాలను యాక్సెస్ చేయండి.",

  manage_users: "వినియోగదారులను నిర్వహించండి",
  manage_users_description:
    "విద్యార్థులు, పరీక్షకులు మరియు నిర్వాహకులను చూడండి.",

  examiner_requests: "పరీక్షకుల అభ్యర్థనలు",
  examiner_requests_description:
    "పెండింగ్‌లో ఉన్న పరీక్షకుల రిజిస్ట్రేషన్‌లను సమీక్షించండి.",

  examination_management: "పరీక్ష నిర్వహణ",
  examination_management_description:
    "పరీక్షలు, షెడ్యూల్‌లు మరియు విద్యార్థుల కార్యకలాపాలను పర్యవేక్షించండి.",

  platform: "ప్లాట్‌ఫారమ్",
  system_overview: "సిస్టమ్ అవలోకనం",

  users: "వినియోగదారులు",
  students: "విద్యార్థులు",
  examiners: "పరీక్షకులు",
  approved_examiners: "ఆమోదించబడిన పరీక్షకులు",

  examinations: "పరీక్షలు",
  total_exams: "మొత్తం పరీక్షలు",
  published: "ప్రచురించబడినవి",
  unpublished: "ప్రచురించబడనివి",

  examination_activity: "పరీక్ష కార్యకలాపం",
  total_attempts: "మొత్తం ప్రయత్నాలు",
  submitted: "సమర్పించబడినవి",
  in_progress: "ప్రగతిలో ఉంది",

  user_management: "వినియోగదారుల నిర్వహణ",
  examiner_registration_requests:
    "పరీక్షకుల రిజిస్ట్రేషన్ అభ్యర్థనలు",
  examiner_registration_description:
    "పరీక్షకుల రిజిస్ట్రేషన్ అభ్యర్థనలను సమీక్షించి నిర్వహించండి.",

  pending: "పెండింగ్",
  loading_examiner_requests:
    "పరీక్షకుల అభ్యర్థనలు లోడ్ అవుతున్నాయి...",

  no_pending_requests:
    "పెండింగ్ అభ్యర్థనలు లేవు",
  no_pending_requests_description:
    "ప్రస్తుతం సమీక్ష కోసం పరీక్షకుల రిజిస్ట్రేషన్ అభ్యర్థనలు ఏవీ లేవు.",

  pending_review: "సమీక్ష పెండింగ్",

  approve: "ఆమోదించండి",
  reject: "తిరస్కరించండి",
},


    },
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      supportedLngs: [
        "en",
        "hi",
        "mr",
        "ta",
        "ml",
        "kn",
        "te",
      ],
      load: "languageOnly",

      detection: {
        order: [
          "localStorage",
          "navigator",
          "htmlTag",
        ],

        lookupLocalStorage: "selectedLanguage",
        caches: ["localStorage"],
      },

      interpolation: {
        escapeValue: false,
      },

      react: {
        useSuspense: false,
      },
    });
}

export default i18n;