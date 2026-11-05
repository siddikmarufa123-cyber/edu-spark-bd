export type Lang = "bn" | "en";

const D: Record<string, [string, string]> = {
  home: ["হোম", "Home"], courses: ["সকল কোর্স", "All Courses"], live: ["লাইভ ক্লাস", "Live Classes"],
  exams: ["পরীক্ষা", "Exams"], ebooks: ["ই-বুক", "E-Books"], instructors: ["শিক্ষকবৃন্দ", "Instructors"],
  contact: ["যোগাযোগ", "Contact Us"], login: ["লগইন", "Login"], register: ["রেজিস্ট্রেশন", "Register"],
  logout: ["লগআউট", "Logout"], dashboard: ["শিক্ষার্থী ড্যাশবোর্ড", "Student Dashboard"],
  details: ["বিস্তারিত দেখুন", "View details"], enroll: ["কোর্সে ভর্তি হও", "Enroll now"],
  closed: ["ভর্তি বন্ধ", "Enrollment closed"], teacher: ["শিক্ষক", "Teacher"], months: ["মাস", "months"],
  classes: ["ক্লাস", "classes"], students: ["শিক্ষার্থী", "students"], payment: ["পেমেন্ট মাধ্যম", "Payment"],
  maint: ["ওয়েবসাইট রক্ষণাবেক্ষণে আছে", "Under maintenance"], maintSub: ["কিছুক্ষণ পর আবার আসুন।", "Please check back soon."],
  noCourses: ["এই ক্যাটাগরিতে এখনও কোর্স নেই।", "No courses in this category yet."],
  email: ["ইমেইল", "Email"], password: ["পাসওয়ার্ড", "Password"], name: ["আপনার নাম", "Your name"],
  badLogin: ["ইমেইল বা পাসওয়ার্ড ভুল।", "Wrong email or password."],
  regClosed: ["নতুন রেজিস্ট্রেশন এখন বন্ধ আছে।", "Registration is closed."],
  checkMail: ["রেজিস্ট্রেশন হয়েছে। ইমেইল যাচাই করে লগইন করুন।", "Registered. Verify your email, then log in."],
  noAccount: ["অ্যাকাউন্ট নেই?", "No account?"], haveAccount: ["আগে থেকেই অ্যাকাউন্ট আছে?", "Already have an account?"],
  myCourses: ["আমার কোর্স", "My Courses"], status_pending: ["অপেক্ষমাণ (পেমেন্ট যাচাই বাকি)", "Pending (payment check)"],
  status_active: ["চালু", "Active"], status_cancelled: ["বাতিল", "Cancelled"],
  noEnroll: ["এখনও কোনো কোর্সে ভর্তি হননি।", "You have not enrolled in any course yet."],
  superAdmin: ["সুপার অ্যাডমিন", "Super Admin"], enrolled: ["ভর্তির অনুরোধ জমা হয়েছে।", "Enrollment requested."],
};

export const t = (lang: Lang, k: string) => (D[k] ? D[k][lang === "bn" ? 0 : 1] : k);

export function num(lang: Lang, n: number | string) {
  const s = Number(n).toLocaleString("en-US");
  return lang === "bn" ? s.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]) : s;
}
