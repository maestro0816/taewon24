/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';

const SON_EOMNEUN_NAL_MAP: Record<string, number[]> = {
  '2026-01': [7, 8, 17, 18, 27, 28],
  '2026-02': [6, 7, 16, 25, 26],
  '2026-03': [7, 8, 17, 18, 27, 28],
  '2026-04': [6, 7, 16, 25, 26],
  '2026-05': [5, 6, 15, 16, 25, 26],
  '2026-06': [4, 5, 14, 23, 24],
  '2026-07': [3, 4, 13, 22, 23],
  '2026-08': [1, 2, 11, 12, 21, 22, 31],
  '2026-09': [1, 10, 19, 20, 29, 30],
  '2026-10': [9, 10, 19, 20, 29, 30],
  '2026-11': [8, 17, 18, 27, 28],
  '2026-12': [7, 8, 17, 18, 27, 28],
  '2027-01': [6, 7, 16, 17, 26, 27],
  '2027-02': [5, 6, 15, 16, 25, 26],
  '2027-03': [7, 16, 17, 26, 27],
  '2027-04': [5, 6, 15, 16, 25, 26],
  '2027-05': [5, 14, 15, 24, 25],
  '2027-06': [3, 4, 13, 14, 23, 24],
  '2027-07': [3, 12, 13, 22, 23],
  '2027-08': [1, 10, 11, 20, 21, 30, 31],
  '2027-09': [9, 10, 19, 20, 29],
  '2027-10': [8, 9, 18, 19, 28],
  '2027-11': [6, 7, 16, 17, 26, 27],
  '2027-12': [6, 7, 16, 17, 26, 27],
};

const WEEKDAY_NAMES = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
const WEEKDAY_SHORT = ['일', '월', '화', '수', '목', '금', '토'];

interface SelectedDateInfo {
  key: string;
  title: string;
  desc: string;
}

interface ChecklistGroup {
  step: string;
  timing: string;
  title: string;
  items: { id: string; text: string; tip: string }[];
}

const MOVING_CHECKLIST_GROUPS: ChecklistGroup[] = [
  {
    step: '01',
    timing: '이사 1~2주 전',
    title: '일정 · 시설 · 폐기물 정리',
    items: [
      {
        id: 'prep-elevator',
        text: '엘리베이터 사용 예약 및 관리실 신고',
        tip: '사다리차 진입 가능 여부도 함께 확인해 주세요.',
      },
      {
        id: 'prep-utility-move',
        text: '인터넷 · TV · 정수기 · 에어컨 이전 접수',
        tip: '성수기에는 설치 기사 예약이 빨리 마감됩니다.',
      },
      {
        id: 'prep-waste',
        text: '안 쓰는 대형 가구 · 가전 폐기물 신청',
        tip: '이사 전 미리 비우면 짐 부피와 비용을 줄일 수 있습니다.',
      },
      {
        id: 'prep-bills',
        text: '관리비 · 가스 · 전기 · 수도 정산 일정 확인',
        tip: '자동이체 해지 및 이사 당일 정산 방법을 체크하세요.',
      },
    ],
  },
  {
    step: '02',
    timing: '이사 2~3일 전',
    title: '가전 비우기 · 귀중품 분리',
    items: [
      {
        id: 'prep-fridge',
        text: '냉장고 · 김치냉장고 비우기 및 성에 제거',
        tip: '보관이사 시에는 음식물을 완전히 비우고 건조해 주세요.',
      },
      {
        id: 'prep-washer',
        text: '세탁기 물 빼기 및 배수 호스 정리',
        tip: '동파 및 이동 중 물 샘 방지를 위해 잔수를 제거합니다.',
      },
      {
        id: 'prep-valuables',
        text: '귀중품 · 현금 · 중요 서류 별도 보관',
        tip: '계약서·인감·신분증 등은 개인 가방에 직접 챙겨 주세요.',
      },
      {
        id: 'prep-gas',
        text: '도시가스 철거 예약 (당일 오전 방문)',
        tip: '지역 도시가스 고객센터에 미리 철거 예약을 해두세요.',
      },
    ],
  },
  {
    step: '03',
    timing: '이사 당일',
    title: '보관 분리 · 입출고 최종 점검',
    items: [
      {
        id: 'prep-storage-bag',
        text: '보관 중 바로 쓸 옷 · 생필품 따로 챙기기',
        tip: '컨테이너 봉인 후에도 필요한 계절옷·약 등은 분리해 두세요.',
      },
      {
        id: 'prep-access',
        text: '현관 비밀번호 · 주차 등록 · 새집 열쇠 확인',
        tip: '출발지·도착지 출입 정보를 미리 공유하면 작업이 빨라집니다.',
      },
      {
        id: 'prep-meter',
        text: '공과금 계량기 검침 사진 촬영 및 정산',
        tip: '전기·수도·가스 계량기 숫자를 사진으로 남겨두면 안전합니다.',
      },
      {
        id: 'prep-final',
        text: '신발장 · 베란다 · 창고 누락 물품 최종 확인',
        tip: '종량제 봉투를 넉넉히 준비해 마무리 정리에 활용하세요.',
      },
    ],
  },
];

const TOTAL_CHECKLIST_ITEMS = MOVING_CHECKLIST_GROUPS.reduce(
  (sum, group) => sum + group.items.length,
  0,
);

function isSonEomneunNal(year: number, monthIndex: number, day: number): boolean {
  const ymKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
  const monthDates = SON_EOMNEUN_NAL_MAP[ymKey];
  if (!monthDates) return false;
  return monthDates.includes(day);
}

export default function App() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 0-indexed (10 = November 2026)
  const [selectedDate, setSelectedDate] = useState<SelectedDateInfo | null>(null);
  const [heroImageError, setHeroImageError] = useState(false);
  const [logoImageError, setLogoImageError] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  const toggleChecklistItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const resetChecklist = () => {
    setCheckedItems({});
  };

  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number, isGood: boolean) => {
    const key = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const wName = WEEKDAY_NAMES[new Date(currentYear, currentMonth, day).getDay()];
    setSelectedDate({
      key,
      title: `${currentYear}년 ${currentMonth + 1}월 ${day}일 (${wName}) · ${isGood ? '손 없는 날' : '일반일'}`,
      desc: isGood
        ? '손 없는 날로 알려진 날짜입니다. 보관이사·포장이사 예약은 서둘러 010-4550-1114로 문의해 주세요.'
        : '일반 일정일로, 100% 태원 자가 창고 부지 보관이사 및 포장이사 상담이 가능합니다.',
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F5EF] text-[#231C18]">
      {/* Header */}
      <header className="sticky top-0 z-100 border-b border-[#E2D5C5] bg-[#F9F5EF]/96 backdrop-blur-[10px]">
        <div className="mx-auto flex h-[68px] w-full max-w-[1120px] items-center justify-between gap-[10px] px-4 sm:h-[80px] sm:gap-4 sm:px-5">
          <a href="#" className="flex shrink-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[11px] border border-[#82361B]/20 bg-[#A64B2A] shadow-[0_4px_12px_rgba(166,75,42,0.18)] sm:h-11 sm:w-11">
              {!logoImageError ? (
                <img
                  src="/src/assets/images/taewon_logo_refined_1795330833621.jpg"
                  alt="태원익스프레스 로고"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoImageError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-[0.95rem] font-extrabold text-[#FAF5EE]">태원</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="whitespace-nowrap text-[1.28rem] leading-[1.15] font-extrabold tracking-[-0.02em] text-[#231C18] sm:text-[1.52rem]">
                태원익스프레스
              </span>
              <span className="whitespace-nowrap text-[0.72rem] font-bold text-[#A64B2A] sm:text-[0.8rem]">
                부산 보관이사 · 포장이사 전문
              </span>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-[0.96rem] font-semibold text-[#574B43] md:flex">
            <a href="#company" className="whitespace-nowrap hover:text-[#A64B2A]">
              회사정보
            </a>
            <a href="#storage" className="whitespace-nowrap hover:text-[#A64B2A]">
              보관이사
            </a>
            <a href="#services" className="whitespace-nowrap hover:text-[#A64B2A]">
              이사 서비스
            </a>
            <a href="#checklist" className="whitespace-nowrap hover:text-[#A64B2A]">
              준비사항
            </a>
            <a href="#calendar" className="whitespace-nowrap hover:text-[#A64B2A]">
              손 없는 날
            </a>
          </nav>

          <a
            href="tel:01045501114"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#A64B2A] px-[13px] py-2 text-[0.84rem] font-bold text-white shadow-[0_6px_16px_rgba(166,75,42,0.24)] transition duration-150 hover:-translate-y-px hover:bg-[#82361B] sm:px-[18px] sm:py-[10px] sm:text-[0.92rem]"
          >
            <span className="inline-flex items-center justify-center text-[1.02em] leading-none text-[#FFF3D1]" aria-hidden="true">
              ☎
            </span>{' '}
            010-4550-1114
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#FBF8F3] to-[#F9F5EF] py-9 pb-[46px] sm:py-[58px] sm:pb-[66px]">
          <div className="mx-auto grid w-full max-w-[1120px] grid-cols-1 items-center gap-6 px-4 sm:gap-9 sm:px-5 lg:grid-cols-[1.12fr_0.88fr]">
            <div>
              <span className="mb-4 inline-block rounded-full border border-[#EBD0A2] bg-[#FDF5E6] px-[14px] py-[6px] text-[0.86rem] font-bold text-[#8C5A14]">
                부산 전지역 · 컨테이너 통째 적재 보관이사
              </span>
              <h1 className="mb-4 text-[clamp(1.95rem,3.8vw,2.85rem)] font-extrabold leading-[1.24] tracking-[-0.03em] text-[#231C18]">
                창고에서 짐을 내리지 않는
                <br />
                <span className="text-[#A64B2A]">태원익스프레스</span> 보관이사
              </h1>
              <p className="mb-[18px] text-[0.96rem] text-[#574B43] sm:mb-6 sm:text-[1.04rem]">
                보관이사와 포장이사를 고민 중이신가요? 태원익스프레스는 짐을 일일이 내렸다 다시 싣지 않고,{' '}
                <strong>지게차로 컨테이너 자체를 싣고 적재</strong>하여 파손과 분실 걱정을 줄였습니다.
              </p>

              <div className="mb-5 grid grid-cols-1 gap-[10px] sm:mb-7 sm:grid-cols-2 sm:gap-3">
                <div className="rounded-[8px] border border-[#E2D5C5] border-l-4 border-l-[#A64B2A] bg-white px-[15px] py-[14px] text-[0.94rem] font-bold text-[#231C18] shadow-[0_4px_12px_rgba(35,28,24,0.04)]">
                  지게차 컨테이너 통째 적재
                  <small className="mt-[3px] block text-[0.8rem] font-medium text-[#574B43]">
                    짐을 내리지 않고 안전하게 이동·보관
                  </small>
                </div>
                <div className="rounded-[8px] border border-[#E2D5C5] border-l-4 border-l-[#A64B2A] bg-white px-[15px] py-[14px] text-[0.94rem] font-bold text-[#231C18] shadow-[0_4px_12px_rgba(35,28,24,0.04)]">
                  100% 태원 자가 창고 부지
                  <small className="mt-[3px] block text-[0.8rem] font-medium text-[#574B43]">
                    합리적보관료
                  </small>
                </div>
              </div>

              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href="tel:01045501114"
                  className="inline-flex w-full items-center justify-center gap-[10px] rounded-[12px] bg-[#A64B2A] px-[18px] py-[14px] text-[0.96rem] font-bold text-white shadow-[0_10px_22px_rgba(166,75,42,0.24)] hover:bg-[#82361B] sm:w-auto sm:px-[26px] sm:py-[15px] sm:text-[1.02rem]"
                >
                  <span className="inline-flex items-center justify-center text-[1.02em] leading-none text-[#FFF3D1]" aria-hidden="true">
                    ☎
                  </span>{' '}
                  전화 상담 010-4550-1114
                </a>
                <a
                  href="#calendar"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#E2D5C5] bg-white px-[18px] py-[14px] text-[0.96rem] font-bold text-[#231C18] hover:bg-[#F2EAE0] sm:w-auto sm:px-[22px] sm:py-[15px] sm:text-[1rem]"
                >
                  📅 손 없는 날 확인하기
                </a>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#E2D5C5] bg-white p-3.5 shadow-[0_12px_30px_rgba(35,28,24,0.07)] sm:p-[18px]">
              <div className="aspect-[3/2] w-full overflow-hidden rounded-[14px] border border-[#E2D5C5]/70 bg-[#FAF5EE]">
                {!heroImageError ? (
                  <img
                    src="/src/assets/images/taewon_logistics_hero_20ft_clean_1795325063331.jpg"
                    alt="태원익스프레스 20피트 컨테이너 적재용 평판 화물차와 지게차 일러스트"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImageError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#FDF5E6] to-[#EFE4D6] px-6 text-center">
                    <span className="text-[1.05rem] font-extrabold text-[#82361B]">태원익스프레스</span>
                    <span className="mt-1 text-[0.88rem] font-medium text-[#574B43]">
                      이사 차량 · 지게차 컨테이너 통째 적재 · 100% 자가 부지
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-3.5 px-1 text-center">
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[0.82rem] font-bold text-[#A64B2A]">
                  <span>이사 차량</span>
                  <span aria-hidden="true">·</span>
                  <span>지게차 컨테이너 통째 적재</span>
                  <span aria-hidden="true">·</span>
                  <span>합리적보관료</span>
                </div>
                <p className="mt-1 text-[0.9rem] font-semibold text-[#231C18]">
                  이사 차량과 지게차로 컨테이너를 통째로 싣고 적재해 안전하게 보관합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Information Section */}
        <section id="company" className="border-y border-[#E2D5C5] bg-[#F2EAE0] py-12 sm:py-[66px]">
          <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-5">
            <div className="mx-auto mb-7 max-w-[700px] text-center sm:mb-10">
              <span className="mb-2 inline-block text-[0.84rem] font-extrabold tracking-[0.04em] text-[#A64B2A]">
                COMPANY INFO
              </span>
              <h2 className="mb-[10px] text-[clamp(1.58rem,2.8vw,2.15rem)] font-extrabold tracking-[-0.02em] text-[#231C18]">
                <span aria-hidden="true">🏢</span> 태원익스프레스 회사정보
              </h2>
              <p className="text-[0.98rem] text-[#574B43]">
                등록된 사업자 및 운송사업 정보를 바탕으로 투명하고 책임감 있게 운영합니다.
              </p>
            </div>

            <div className="rounded-[18px] border border-[#E2D5C5] bg-white p-5 shadow-[0_12px_30px_rgba(35,28,24,0.07)] sm:rounded-[24px] sm:p-8">
              <table className="w-full border-collapse text-[0.9rem] sm:text-[0.95rem]">
                <tbody>
                  <tr>
                    <th className="block w-full border-b-0 bg-[#FAF5EE] px-3 py-[10px] pb-[6px] text-left align-top font-bold text-[#231C18] md:table-cell md:w-[180px] md:border-b md:border-[#E2D5C5] md:px-4 md:py-[14px]">
                      상호
                    </th>
                    <td className="block w-full border-b border-[#E2D5C5] px-3 py-[10px] pt-1 text-left align-top font-medium text-[#574B43] md:table-cell md:w-auto md:px-4 md:py-[14px]">
                      태원익스프레스
                    </td>
                  </tr>
                  <tr>
                    <th className="block w-full border-b-0 bg-[#FAF5EE] px-3 py-[10px] pb-[6px] text-left align-top font-bold text-[#231C18] md:table-cell md:w-[180px] md:border-b md:border-[#E2D5C5] md:px-4 md:py-[14px]">
                      대표자
                    </th>
                    <td className="block w-full border-b border-[#E2D5C5] px-3 py-[10px] pt-1 text-left align-top font-medium text-[#574B43] md:table-cell md:w-auto md:px-4 md:py-[14px]">
                      강태섭
                    </td>
                  </tr>
                  <tr>
                    <th className="block w-full border-b-0 bg-[#FAF5EE] px-3 py-[10px] pb-[6px] text-left align-top font-bold text-[#231C18] md:table-cell md:w-[180px] md:border-b md:border-[#E2D5C5] md:px-4 md:py-[14px]">
                      사업자등록번호
                    </th>
                    <td className="block w-full border-b border-[#E2D5C5] px-3 py-[10px] pt-1 text-left align-top font-medium text-[#574B43] md:table-cell md:w-auto md:px-4 md:py-[14px]">
                      621-18-15213
                    </td>
                  </tr>
                  <tr>
                    <th className="block w-full border-b-0 bg-[#FAF5EE] px-3 py-[10px] pb-[6px] text-left align-top font-bold text-[#231C18] md:table-cell md:w-[180px] md:border-b md:border-[#E2D5C5] md:px-4 md:py-[14px]">
                      운송사업허가번호
                    </th>
                    <td className="block w-full border-b border-[#E2D5C5] px-3 py-[10px] pt-1 text-left align-top font-medium text-[#574B43] md:table-cell md:w-auto md:px-4 md:py-[14px]">
                      제09-231호
                    </td>
                  </tr>
                  <tr>
                    <th className="block w-full border-b-0 bg-[#FAF5EE] px-3 py-[10px] pb-[6px] text-left align-top font-bold text-[#231C18] md:table-cell md:w-[180px] md:border-b md:border-[#E2D5C5] md:px-4 md:py-[14px]">
                      본사 주소
                    </th>
                    <td className="block w-full border-b border-[#E2D5C5] px-3 py-[10px] pt-1 text-left align-top font-medium text-[#574B43] md:table-cell md:w-auto md:px-4 md:py-[14px]">
                      부산광역시 해운대구 재반로 57-14 (재송동 474)
                    </td>
                  </tr>
                  <tr>
                    <th className="block w-full border-b-0 bg-[#FAF5EE] px-3 py-[10px] pb-[6px] text-left align-top font-bold text-[#231C18] md:table-cell md:w-[180px] md:border-b md:border-[#E2D5C5] md:px-4 md:py-[14px]">
                      보관창고 주소
                    </th>
                    <td className="block w-full border-b border-[#E2D5C5] px-3 py-[10px] pt-1 text-left align-top font-medium text-[#574B43] md:table-cell md:w-auto md:px-4 md:py-[14px]">
                      부산광역시 금정구 회동동 558-4
                    </td>
                  </tr>
                  <tr>
                    <th className="block w-full border-b-0 bg-[#FAF5EE] px-3 py-[10px] pb-[6px] text-left align-top font-bold text-[#231C18] md:table-cell md:w-[180px] md:border-b md:border-[#E2D5C5] md:px-4 md:py-[14px]">
                      상담 전화
                    </th>
                    <td className="block w-full border-b border-[#E2D5C5] px-3 py-[10px] pt-1 text-left align-top font-medium text-[#574B43] md:table-cell md:w-auto md:px-4 md:py-[14px]">
                      <a href="tel:01045501114" className="font-bold text-[#82361B]">
                        010-4550-1114
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th className="block w-full border-b-0 bg-[#FAF5EE] px-3 py-[10px] pb-[6px] text-left align-top font-bold text-[#231C18] md:table-cell md:w-[180px] md:px-4 md:py-[14px]">
                      주요 업무
                    </th>
                    <td className="block w-full px-3 py-[10px] pt-1 text-left align-top font-medium text-[#574B43] md:table-cell md:w-auto md:px-4 md:py-[14px]">
                      부산 보관이사 · 포장이사 · 100% 태원 자가 창고 부지 컨테이너 적재 보관
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-6 border-t border-[#E2D5C5] pt-6">
                <div className="mb-[14px] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[1.04rem] font-extrabold text-[#231C18]">
                      📍 오시는 길 · 보관창고 위치 지도
                    </div>
                    <div className="text-[0.9rem] font-medium text-[#574B43]">
                      보관창고: 부산광역시 금정구 회동동 558-4
                    </div>
                  </div>
                  <a
                    href="https://map.kakao.com/?q=%EB%B6%80%EC%82%B0%EA%B4%91%EC%97%AD%EC%8B%9C%20%EA%B8%88%EC%A0%95%EA%B5%AC%20%ED%9A%8C%EB%8F%99%EB%8F%99%20558-4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-[6px] rounded-[8px] border border-[#E7C3B2] bg-[#FBEFE9] px-[14px] py-2 text-[0.88rem] font-bold text-[#82361B] hover:border-[#A64B2A] hover:bg-[#A64B2A] hover:text-white sm:w-auto"
                  >
                    지도 크게 보기 ↗
                  </a>
                </div>

                <div className="h-[250px] w-full overflow-hidden rounded-[12px] border border-[#E2D5C5] bg-[#F9F5EF] sm:h-[320px]">
                  <iframe
                    title="태원익스프레스 보관창고 위치 지도 (부산광역시 금정구 회동동 558-4)"
                    src="https://maps.google.com/maps?q=%EB%B6%80%EC%82%B0%EA%B4%91%EC%97%AD%EC%8B%9C%20%EA%B8%88%EC%A0%95%EA%B5%AC%20%ED%9A%8C%EB%8F%99%EB%8F%99%20558-4&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="block h-full w-full border-0"
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-end gap-[10px] text-[0.86rem] text-[#574B43]">
                  <a
                    href="tel:01045501114"
                    className="inline-flex w-full items-center justify-center gap-[6px] rounded-[8px] border border-[#E7C3B2] bg-[#FBEFE9] px-[14px] py-2 text-[0.88rem] font-bold text-[#82361B] hover:border-[#A64B2A] hover:bg-[#A64B2A] hover:text-white sm:w-auto"
                  >
                    📞 위치 문의
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Storage Section */}
        <section id="storage" className="py-12 sm:py-[66px]">
          <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-5">
            <div className="mx-auto mb-7 max-w-[700px] text-center sm:mb-10">
              <span className="mb-2 inline-block text-[0.84rem] font-extrabold tracking-[0.04em] text-[#A64B2A]">
                TAEWON STORAGE SYSTEM
              </span>
              <h2 className="mb-[10px] text-[clamp(1.58rem,2.8vw,2.15rem)] font-extrabold tracking-[-0.02em] text-[#231C18]">
                <span aria-hidden="true">📦</span> 보관이사, 이제 짐을 내리지 마세요
              </h2>
              <p className="text-[0.98rem] text-[#574B43]">
                일반 보관이사처럼 짐을 꺼내어 창고에 다시 쌓는 과정에서 생기는 흠집과 분실 위험을 줄이기 위해 컨테이너 단위 적재 방식을 적용합니다.
              </p>
            </div>

            <div className="mb-9 grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="rounded-[18px] border border-[#E2D5C5] bg-white p-5 shadow-[0_12px_30px_rgba(35,28,24,0.07)] sm:p-6">
                <span className="mb-[14px] inline-flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#FBEFE9] text-[0.92rem] font-extrabold text-[#82361B]">
                  01
                </span>
                <h3 className="mb-2 text-[1.14rem] font-extrabold text-[#231C18]">
                  컨테이너 꼼꼼 포장 및 적재
                </h3>
                <p className="text-[0.93rem] text-[#574B43]">
                  보관용 자재로 안전하게 포장한 뒤 전용 컨테이너에 흔들림 없도록 가지런히 싣습니다.
                </p>
              </div>

              <div className="rounded-[18px] border border-[#E2D5C5] bg-white p-5 shadow-[0_12px_30px_rgba(35,28,24,0.07)] sm:p-6">
                <span className="mb-[14px] inline-flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#FBEFE9] text-[0.92rem] font-extrabold text-[#82361B]">
                  02
                </span>
                <h3 className="mb-2 text-[1.14rem] font-extrabold text-[#231C18]">
                  지게차 통째 상·하차
                </h3>
                <p className="text-[0.93rem] text-[#574B43]">
                  짐을 일일이 바닥에 내리지 않고 지게차로 컨테이너 자체를 들어 올려 이동하고 적재합니다.
                </p>
              </div>

              <div className="rounded-[18px] border border-[#E2D5C5] bg-white p-5 shadow-[0_12px_30px_rgba(35,28,24,0.07)] sm:p-6">
                <span className="mb-[14px] inline-flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#FBEFE9] text-[0.92rem] font-extrabold text-[#82361B]">
                  03
                </span>
                <h3 className="mb-2 text-[1.14rem] font-extrabold text-[#231C18]">
                  100% 태원 자가 창고 부지 보관
                </h3>
                <p className="text-[0.93rem] text-[#574B43]">
                  중간 임대 창고가 아닌 100% 태원 자가 창고 부지에서 관리하여 합리적보관료로 오래 맡기실 수 있습니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-[22px] lg:grid-cols-2">
              <div className="rounded-[18px] border-2 border-[#A64B2A] bg-white p-5 shadow-[0_12px_30px_rgba(35,28,24,0.07)] sm:p-7">
                <div className="mb-4 flex items-center justify-between text-[1.18rem] font-extrabold text-[#231C18]">
                  <span>태원익스프레스 보관이사</span>
                  <span className="rounded-full bg-[#FDF5E6] px-[10px] py-1 text-[0.8rem] font-bold text-[#8C5A14]">
                    추천 방식
                  </span>
                </div>
                <ul className="flex flex-col gap-3 text-[0.95rem]">
                  <li className="relative pl-[22px] font-semibold text-[#231C18]">
                    <span className="absolute left-0 font-extrabold text-[#A64B2A]">✓</span>
                    짐을 내리지 않고 지게차로 컨테이너 자체를 싣고 적재
                  </li>
                  <li className="relative pl-[22px] font-semibold text-[#231C18]">
                    <span className="absolute left-0 font-extrabold text-[#A64B2A]">✓</span>
                    짐 재적재 횟수를 줄여 가구·가전 긁힘 및 파손 예방
                  </li>
                  <li className="relative pl-[22px] font-semibold text-[#231C18]">
                    <span className="absolute left-0 font-extrabold text-[#A64B2A]">✓</span>
                    100% 태원 자가 창고 부지 운영으로 합리적보관료 제공
                  </li>
                  <li className="relative pl-[22px] font-semibold text-[#231C18]">
                    <span className="absolute left-0 font-extrabold text-[#A64B2A]">✓</span>
                    부산 전지역 일정에 맞춘 유연한 보관 및 재입주 연계
                  </li>
                </ul>
              </div>

              <div className="rounded-[18px] border border-[#E2D5C5] bg-white p-5 sm:p-7">
                <div className="mb-4 flex items-center justify-between text-[1.18rem] font-extrabold text-[#231C18]">
                  <span>일반 창고 보관 방식</span>
                </div>
                <ul className="flex flex-col gap-3 text-[0.95rem]">
                  <li className="relative pl-[22px] text-[#574B43]">
                    <span className="absolute left-1 text-[#7D6E63]">•</span>
                    차량에서 짐을 내린 뒤 창고 내부로 다시 옮겨 쌓는 과정 발생
                  </li>
                  <li className="relative pl-[22px] text-[#574B43]">
                    <span className="absolute left-1 text-[#7D6E63]">•</span>
                    옮기는 횟수가 늘어날수록 모서리 찍힘이나 분실 우려 증가
                  </li>
                  <li className="relative pl-[22px] text-[#574B43]">
                    <span className="absolute left-1 text-[#7D6E63]">•</span>
                    외부 임대 창고 구조에 따른 비용 변동 가능성
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="border-y border-[#E2D5C5] bg-[#F2EAE0] py-12 sm:py-[66px]">
          <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-5">
            <div className="mx-auto mb-7 max-w-[700px] text-center sm:mb-10">
              <span className="mb-2 inline-block text-[0.84rem] font-extrabold tracking-[0.04em] text-[#A64B2A]">
                SERVICE
              </span>
              <h2 className="mb-[10px] text-[clamp(1.58rem,2.8vw,2.15rem)] font-extrabold tracking-[-0.02em] text-[#231C18]">
                <span aria-hidden="true">🚚</span> 부산 보관이사 · 포장이사 안내
              </h2>
              <p className="text-[0.98rem] text-[#574B43]">
                고객님의 이사 일정과 상황에 맞춰 보관이사와 포장이사를 정성껏 진행합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="flex flex-col justify-between rounded-[18px] border border-[#E2D5C5] bg-white p-5 shadow-[0_12px_30px_rgba(35,28,24,0.07)] sm:p-[30px]">
                <div>
                  <h3 className="mb-[10px] text-[1.35rem] font-extrabold text-[#231C18]">보관이사</h3>
                  <p className="mb-[18px] text-[0.95rem] text-[#574B43]">
                    인테리어 공사, 매매·전세 일정 차이, 해외 체류 등으로 당일 입주가 어려운 고객님을 위한 핵심 서비스입니다.
                  </p>
                  <ul className="mb-[22px] flex flex-col gap-2 text-[0.93rem] font-medium text-[#231C18]">
                    <li>
                      <span className="font-extrabold text-[#A64B2A]">· </span>짐을 바닥에 내리지 않고 지게차로 컨테이너 자체를 싣고 적재
                    </li>
                    <li>
                      <span className="font-extrabold text-[#A64B2A]">· </span>100% 태원 자가 창고 부지 보관 및 합리적보관료
                    </li>
                    <li>
                      <span className="font-extrabold text-[#A64B2A]">· </span>원하시는 날짜에 맞춰 컨테이너 출고 후 입주 진행
                    </li>
                  </ul>
                </div>
                <a
                  href="tel:01045501114"
                  className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#E7C3B2] bg-[#FBEFE9] px-[18px] py-[13px] text-[0.95rem] font-bold text-[#82361B] hover:border-[#A64B2A] hover:bg-[#A64B2A] hover:text-white"
                >
                  보관이사 전화 문의 · 010-4550-1114
                </a>
              </div>

              <div className="flex flex-col justify-between rounded-[18px] border border-[#E2D5C5] bg-white p-5 shadow-[0_12px_30px_rgba(35,28,24,0.07)] sm:p-[30px]">
                <div>
                  <h3 className="mb-[10px] text-[1.35rem] font-extrabold text-[#231C18]">포장이사</h3>
                  <p className="mb-[18px] text-[0.95rem] text-[#574B43]">
                    포장부터 운반, 배치, 마무리 정리까지 체계적으로 도와드리는 부산 지역 맞춤 포장이사 서비스입니다.
                  </p>
                  <ul className="mb-[22px] flex flex-col gap-2 text-[0.93rem] font-medium text-[#231C18]">
                    <li>
                      <span className="font-extrabold text-[#A64B2A]">· </span>가구 및 생활용품 특성에 맞춘 꼼꼼한 포장
                    </li>
                    <li>
                      <span className="font-extrabold text-[#A64B2A]">· </span>부산 전지역 신속하고 안전한 운송 및 배치
                    </li>
                    <li>
                      <span className="font-extrabold text-[#A64B2A]">· </span>이사 일정 상담부터 당일 진행까지 친절한 안내
                    </li>
                  </ul>
                </div>
                <a
                  href="tel:01045501114"
                  className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#E7C3B2] bg-[#FBEFE9] px-[18px] py-[13px] text-[0.95rem] font-bold text-[#82361B] hover:border-[#A64B2A] hover:bg-[#A64B2A] hover:text-white"
                >
                  포장이사 전화 문의 · 010-4550-1114
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Moving Preparation Checklist Section */}
        <section id="checklist" className="py-12 sm:py-[66px]">
          <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-5">
            <div className="mx-auto mb-7 max-w-[700px] text-center sm:mb-10">
              <span className="mb-2 inline-block text-[0.84rem] font-extrabold tracking-[0.04em] text-[#A64B2A]">
                MOVING CHECKLIST
              </span>
              <h2 className="mb-[10px] text-[clamp(1.58rem,2.8vw,2.15rem)] font-extrabold tracking-[-0.02em] text-[#231C18]">
                <span aria-hidden="true">✅</span> 이사 전 미리 준비사항 체크리스트
              </h2>
              <p className="text-[0.98rem] text-[#574B43]">
                보관이사·포장이사 당일 불편함이 없도록 시기별로 미리 챙기실 사항을 정리했습니다. 항목을 눌러 직접 체크해 보세요.
              </p>
            </div>

            {/* Checklist Status Bar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-[#E2D5C5] bg-white px-5 py-4 shadow-[0_6px_18px_rgba(35,28,24,0.04)]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[0.95rem] font-extrabold text-[#231C18]">
                  준비 진행 현황
                </span>
                <span className="text-[0.92rem] font-bold tabular-nums text-[#A64B2A]">
                  {checkedCount} / {TOTAL_CHECKLIST_ITEMS} 완료
                </span>
                <div className="flex h-2 w-32 gap-1 sm:w-44" aria-hidden="true">
                  {Array.from({ length: TOTAL_CHECKLIST_ITEMS }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-full flex-1 rounded-full transition-colors duration-150 ${
                        idx < checkedCount ? 'bg-[#A64B2A]' : 'bg-[#EFE4D6]'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {checkedCount > 0 && (
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={resetChecklist}
                    className="cursor-pointer rounded-[8px] border border-[#E2D5C5] bg-[#F9F5EF] px-3 py-1.5 text-[0.84rem] font-bold text-[#574B43] hover:bg-[#F2EAE0] hover:text-[#231C18]"
                  >
                    체크 초기화
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {MOVING_CHECKLIST_GROUPS.map((group) => (
                <div
                  key={group.step}
                  className="flex flex-col rounded-[18px] border border-[#E2D5C5] bg-white p-5 shadow-[0_12px_30px_rgba(35,28,24,0.07)] sm:p-6"
                >
                  <div className="mb-4 border-b border-[#E2D5C5] pb-3.5">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#FBEFE9] text-[0.8rem] font-extrabold tabular-nums text-[#82361B]">
                        {group.step}
                      </span>
                      <span className="text-[0.84rem] font-bold text-[#A64B2A]">{group.timing}</span>
                    </div>
                    <h3 className="text-[1.12rem] font-extrabold text-[#231C18]">{group.title}</h3>
                  </div>

                  <ul className="flex flex-col gap-2.5">
                    {group.items.map((item) => {
                      const isChecked = !!checkedItems[item.id];
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => toggleChecklistItem(item.id)}
                            aria-pressed={isChecked}
                            className={`flex w-full cursor-pointer items-start gap-3 rounded-[10px] border p-3 text-left transition duration-150 ${
                              isChecked
                                ? 'border-[#E7C3B2] bg-[#FBEFE9]/75'
                                : 'border-[#E8DEC9] bg-[#FAF5EE]/60 hover:border-[#A64B2A]/60 hover:bg-[#FAF5EE]'
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border text-[0.78rem] font-extrabold transition ${
                                isChecked
                                  ? 'border-[#A64B2A] bg-[#A64B2A] text-white'
                                  : 'border-[#C7B6A2] bg-white text-transparent'
                              }`}
                            >
                              ✓
                            </span>
                            <span className="flex flex-col">
                              <span
                                className={`text-[0.93rem] font-bold leading-[1.4] ${
                                  isChecked ? 'text-[#82361B] line-through' : 'text-[#231C18]'
                                }`}
                              >
                                {item.text}
                              </span>
                              <span className="mt-1 text-[0.8rem] font-medium leading-[1.45] text-[#574B43]">
                                {item.tip}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Son Eomneun Nal Calendar */}
        <section id="calendar" className="border-y border-[#E2D5C5] bg-[#F2EAE0] py-12 sm:py-[66px]">
          <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-5">
            <div className="mx-auto mb-7 max-w-[700px] text-center sm:mb-10">
              <span className="mb-2 inline-block text-[0.84rem] font-extrabold tracking-[0.04em] text-[#A64B2A]">
                MOVING DATE GUIDE
              </span>
              <h2 className="mb-[10px] text-[clamp(1.58rem,2.8vw,2.15rem)] font-extrabold tracking-[-0.02em] text-[#231C18]">
                <span aria-hidden="true">📅</span> 손 없는 날 안내 달력
              </h2>
              <p className="text-[0.98rem] text-[#574B43]">
                이사 날짜를 정하실 때 참고하실 수 있도록 손 없는 날을 표시했습니다. 날짜를 눌러 확인해 보세요.
              </p>
            </div>

            <div className="rounded-[18px] border border-[#E2D5C5] bg-white p-5 shadow-[0_12px_30px_rgba(35,28,24,0.07)] sm:rounded-[24px] sm:p-7">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    aria-label="이전 달"
                    className="h-[38px] w-[38px] cursor-pointer rounded-full border border-[#E2D5C5] bg-[#F9F5EF] text-[1rem] font-bold text-[#231C18] hover:bg-[#F2EAE0]"
                  >
                    ‹
                  </button>
                  <div className="min-w-[130px] text-center text-[1.2rem] font-extrabold text-[#231C18]">
                    {currentYear}년 {currentMonth + 1}월
                  </div>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    aria-label="다음 달"
                    className="h-[38px] w-[38px] cursor-pointer rounded-full border border-[#E2D5C5] bg-[#F9F5EF] text-[1rem] font-bold text-[#231C18] hover:bg-[#F2EAE0]"
                  >
                    ›
                  </button>
                </div>

                <div className="flex flex-wrap gap-[14px] text-[0.88rem] font-medium text-[#231C18]">
                  <span className="inline-flex items-center gap-[6px]">
                    <i className="inline-block h-3 w-3 rounded-[4px] bg-[#A64B2A]" /> 손 없는 날
                  </span>
                  <span className="inline-flex items-center gap-[6px]">
                    <i className="inline-block h-3 w-3 rounded-[4px] bg-[#DFD4C6]" /> 일반일
                  </span>
                </div>
              </div>

              <div className="mb-2 grid grid-cols-7 border-b border-[#E2D5C5] pb-[10px] text-center text-[0.88rem] font-bold text-[#231C18]">
                {WEEKDAY_SHORT.map((dayName, idx) => (
                  <div
                    key={dayName}
                    className={idx === 0 ? 'text-[#B43828]' : idx === 6 ? 'text-[#7D5824]' : ''}
                  >
                    {dayName}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 sm:gap-[6px]">
                {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="min-h-[52px] sm:min-h-[68px]" />
                ))}

                {Array.from({ length: lastDate }).map((_, idx) => {
                  const day = idx + 1;
                  const isGood = isSonEomneunNal(currentYear, currentMonth, day);
                  const key = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isSelected = selectedDate?.key === key;
                  const isSunday = (firstDayOfWeek + idx) % 7 === 0;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSelectDay(day, isGood)}
                      aria-label={`${currentYear}년 ${currentMonth + 1}월 ${day}일 ${isGood ? '손 없는 날' : '일반일'}`}
                      className={`flex min-h-[52px] cursor-pointer flex-col justify-between rounded-[8px] border border-[#E8DEC9] p-1 text-left transition duration-150 hover:-translate-y-px hover:border-[#A64B2A] sm:min-h-[68px] sm:p-[6px] ${
                        isSelected ? 'bg-[#FBEFE9] outline-2 outline-[#A64B2A]' : 'bg-white'
                      }`}
                    >
                      <span
                        className={`text-[0.84rem] font-bold sm:text-[0.92rem] ${
                          isSunday ? 'text-[#B43828]' : 'text-[#231C18]'
                        }`}
                      >
                        {day}
                      </span>
                      <span
                        className={`rounded-[6px] px-[3px] py-[2px] text-center text-[0.64rem] font-bold leading-[1.25] sm:px-[5px] sm:text-[0.72rem] ${
                          isGood ? 'bg-[#FBEFE9] text-[#82361B]' : 'bg-[#F4EFE8] text-[#5E5249]'
                        }`}
                      >
                        {isGood ? '손 없는 날' : '일반일'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-col items-stretch justify-between gap-[14px] rounded-[12px] border border-[#E2D5C5] bg-[#F9F5EF] px-4 py-[14px] sm:flex-row sm:flex-wrap sm:items-center sm:px-5 sm:py-[18px]">
                <div>
                  <strong className="mb-1 block text-[1rem] text-[#231C18]">
                    {selectedDate ? selectedDate.title : '날짜를 선택해 주세요'}
                  </strong>
                  <span className="text-[0.92rem] text-[#574B43]">
                    {selectedDate
                      ? selectedDate.desc
                      : '달력에서 날짜를 누르면 손 없는 날 여부를 바로 확인할 수 있습니다.'}
                  </span>
                </div>
                <a
                  href="tel:01045501114"
                  className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#A64B2A] px-4 py-3 text-[0.84rem] font-bold text-white shadow-[0_6px_16px_rgba(166,75,42,0.24)] transition duration-150 hover:-translate-y-px hover:bg-[#82361B] sm:w-auto sm:px-[18px] sm:py-[10px] sm:text-[0.92rem]"
                >
                  <span className="inline-flex items-center justify-center text-[1.02em] leading-none text-[#FFF3D1]" aria-hidden="true">
                    ☎
                  </span>{' '}
                  일정 상담 010-4550-1114
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#231C18] py-[34px] text-[0.92rem] text-[#F4ECE2] sm:py-11">
        <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="mb-[6px] text-[1.22rem] font-extrabold text-white">태원익스프레스</div>
              <div>부산 보관이사 · 포장이사 전문 | 100% 태원 자가 창고 부지</div>
            </div>
            <div>
              <div className="mb-[6px] text-[1.12rem] font-extrabold text-[#F2B585] sm:text-[1.25rem]">
                <span className="inline-flex items-center justify-center text-[1.02em] leading-none text-[#FFD27D]" aria-hidden="true">
                  ☎
                </span>{' '}
                010-4550-1114
              </div>
              <div>부산 전지역 보관이사 · 포장이사 친절 상담</div>
            </div>
          </div>
          <div className="mt-4 text-[0.85rem] leading-[1.6] text-[#D6C9BC]">
            상호: 태원익스프레스 | 대표: 강태섭 | 사업자등록번호: 621-18-15213 | 운송사업허가번호: 제09-231호
            <br />
            본사 주소: 부산광역시 해운대구 재반로 57-14 (재송동 474) | 보관창고 주소: 부산광역시 금정구 회동동 558-4
          </div>
          <div className="mt-[10px] text-[0.82rem] text-[#A89A8D]">© 태원익스프레스. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
