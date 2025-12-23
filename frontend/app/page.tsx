import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  GraduationCap,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  Zap,
  Brain,
  Target,
  Award,
  Linkedin,
  Mail,
  Quote,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const t = await getTranslations('landing');

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label') },
    { value: t('stat2Value'), label: t('stat2Label') },
    { value: t('stat3Value'), label: t('stat3Label') },
    { value: t('stat4Value'), label: t('stat4Label') },
  ];

  const services = [
    {
      icon: GraduationCap,
      title: t('service1Title'),
      description: t('service1Desc'),
      color: 'bg-blue-600',
      lightColor: 'bg-blue-50',
    },
    {
      icon: Brain,
      title: t('service2Title'),
      description: t('service2Desc'),
      color: 'bg-violet-600',
      lightColor: 'bg-violet-50',
    },
    {
      icon: Zap,
      title: t('service3Title'),
      description: t('service3Desc'),
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
    },
    {
      icon: Target,
      title: t('service4Title'),
      description: t('service4Desc'),
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-50',
    },
  ];

  const benefits = [
    t('benefit1'),
    t('benefit2'),
    t('benefit3'),
    t('benefit4'),
    t('benefit5'),
    t('benefit6'),
  ];

  const achievements = [
    { title: t('ceoAchievement1Title'), desc: t('ceoAchievement1Desc'), icon: Users },
    { title: t('ceoAchievement2Title'), desc: t('ceoAchievement2Desc'), icon: Award },
    { title: t('ceoAchievement3Title'), desc: t('ceoAchievement3Desc'), icon: Target },
    { title: t('ceoAchievement4Title'), desc: t('ceoAchievement4Desc'), icon: Zap },
  ];

  const companies = [
    { name: 'Kaspi', color: 'bg-red-500' },
    { name: 'Halyk', color: 'bg-green-600' },
    { name: 'Air Astana', color: 'bg-cyan-600' },
    { name: 'Technodom', color: 'bg-orange-500' },
    { name: 'OLX', color: 'bg-purple-600' },
    { name: 'Kolesa', color: 'bg-blue-600' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section - Light gradient */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-br from-indigo-100/40 via-purple-100/30 to-pink-100/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute top-60 left-0 w-[300px] h-[300px] bg-violet-100/30 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">{t('badge')}</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-center text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-[1.15]">
            {t('heroTitle')}{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('heroTitleHighlight')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-slate-600 leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              {t('ctaPrimary')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={`mailto:${t('contactEmail')}`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white px-6 py-3.5 text-[15px] font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              {t('ctaSecondary')}
            </a>
          </div>

          {/* Stats Row */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-slate-900">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-sm font-medium text-slate-400 uppercase tracking-wider mb-8">
            {t('trustedByTitle')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {companies.map((company, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 opacity-70 hover:opacity-100 transition-opacity"
              >
                <div className={`h-7 w-7 rounded-lg ${company.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {company.name[0]}
                </div>
                <span className="text-base font-semibold text-slate-600">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              {t('servicesTitle')}
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              {t('servicesSubtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {services.map((service, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${service.color} text-white`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  {service.description}
                </p>
                <ArrowUpRight className="absolute top-7 right-7 h-5 w-5 text-slate-300 transition-all group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-0 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
              {t('benefitsTitle')}
            </h2>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed">
              {t('benefitsSubtitle')}
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Main Testimonial Card */}
            <div className="lg:col-span-8 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 p-8 sm:p-10 lg:p-12 shadow-2xl shadow-indigo-500/20">
                {/* Animated gradient orbs */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl" />

                <div className="relative">
                  {/* Large decorative quote */}
                  <div className="absolute -top-4 -left-2 text-[120px] font-serif text-white/10 leading-none select-none">
                    &ldquo;
                  </div>

                  <Quote className="h-12 w-12 text-white/40 mb-6" />

                  <blockquote className="text-xl sm:text-2xl lg:text-[1.75rem] font-medium text-white leading-relaxed tracking-tight">
                    {t('testimonialText')}
                  </blockquote>

                  <div className="mt-10 flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-br from-white/40 to-transparent rounded-full blur" />
                      <div className="relative h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl ring-2 ring-white/30">
                        M
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-white text-lg">{t('testimonialAuthor')}</div>
                      <div className="text-white/70">{t('testimonialCompany')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Rating Card */}
              <div className="relative group flex-1">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative h-full rounded-2xl bg-white border border-slate-200/80 p-6 shadow-lg shadow-slate-200/50 flex flex-col justify-center">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-amber-400 fill-amber-400 drop-shadow-sm" />
                    ))}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-bold bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">95</span>
                    <span className="text-3xl font-bold text-slate-400">%</span>
                  </div>
                  <div className="mt-2 text-slate-600 font-medium">{t('stat3Label')}</div>
                </div>
              </div>

              {/* Productivity Card */}
              <div className="relative group flex-1">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative h-full rounded-2xl bg-white border border-slate-200/80 p-6 shadow-lg shadow-slate-200/50 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-bold bg-gradient-to-br from-emerald-600 to-cyan-600 bg-clip-text text-transparent">3</span>
                    <span className="text-3xl font-bold text-emerald-400">x</span>
                  </div>
                  <div className="mt-2 text-slate-600 font-medium">{t('stat4Label')}</div>
                </div>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="lg:col-span-12 rounded-2xl bg-white/80 backdrop-blur border border-slate-200/80 p-6 sm:p-8 shadow-lg shadow-slate-200/50">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="group flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-100/50 transition-all duration-300"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-[15px] text-slate-700 font-medium leading-relaxed pt-1">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mentor Section - Minimalist Design */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left - Profile */}
            <div className="flex flex-col items-center lg:items-start">
              {/* Avatar */}
              <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">BZ</span>
                </div>
                <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Name & Role */}
              <h3 className="text-2xl font-bold text-slate-900 mb-1">{t('ceoName')}</h3>
              <p className="text-slate-500 mb-6">{t('ceoRole')}</p>

              {/* Stats */}
              <div className="flex gap-8 mb-8">
                <div>
                  <div className="text-3xl font-bold text-slate-900">400+</div>
                  <div className="text-sm text-slate-500">Trained</div>
                </div>
                <div className="w-px bg-slate-200" />
                <div>
                  <div className="text-3xl font-bold text-slate-900">20+</div>
                  <div className="text-sm text-slate-500">Trainings</div>
                </div>
                <div className="w-px bg-slate-200" />
                <div>
                  <div className="text-3xl font-bold text-slate-900">20+</div>
                  <div className="text-sm text-slate-500">Companies</div>
                </div>
              </div>

              {/* Client logos */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className="font-medium text-slate-500">{t('ceoClientsTitle')}</span>
                {companies.slice(0, 4).map((company, i) => (
                  <span key={i} className="text-slate-600">{company.name}</span>
                ))}
                <span>+46</span>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 mb-6">
                <Award className="h-4 w-4" />
                {t('ceoSectionBadge')}
              </div>

              {/* Headline */}
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-[1.15] mb-2">
                {t('ceoSectionTitle')}
              </h2>
              <p className="text-4xl sm:text-5xl font-bold text-indigo-600 leading-[1.15] mb-8">
                {t('ceoSectionSubtitle')}
              </p>

              {/* Bio */}
              <p className="text-lg text-slate-600 leading-relaxed mb-10">
                {t('ceoBio')}
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`mailto:${t('contactEmail')}`}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-slate-800"
                >
                  {t('ceoBookCall')}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="https://www.linkedin.com/in/bakhredin-zurgambayev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                >
                  <Linkedin className="h-5 w-5" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {t('ctaSectionTitle')}
          </h2>
          <p className="mt-5 text-lg text-white/80 max-w-xl mx-auto">
            {t('ctaSectionSubtitle')}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[15px] font-semibold text-indigo-600 shadow-lg transition-all hover:bg-slate-50 hover:-translate-y-0.5"
            >
              {t('ctaGetStarted')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={`mailto:${t('contactEmail')}`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-white/20"
            >
              <Mail className="h-4 w-4" />
              {t('ctaScheduleDemo')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
