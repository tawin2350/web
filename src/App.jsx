import React, { useEffect, useMemo, useState } from 'react';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faDownload, faMoon, faPlay, faRotateRight, faStar, faSun, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

const scoreLetters = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'];
const axisPairs = [
  ['E', 'I'],
  ['S', 'N'],
  ['T', 'F'],
  ['J', 'P'],
];

function createQuestion(axis, q, leftText, rightText) {
  const [leftType, rightType] = axis.split('-');

  return {
    axis,
    q,
    // แก้ข้อความตัวเลือกของแต่ละข้อได้ที่นี่ หากอยากปรับภาษาของแบบทดสอบ
    options: [
      { text: leftText.strong, type: leftType, weight: 2 },
      { text: leftText.soft, type: leftType, weight: 1 },
      { text: rightText.soft, type: rightType, weight: 1 },
      { text: rightText.strong, type: rightType, weight: 2 },
    ],
  };
}

// ส่วนคำถาม: เพิ่ม/ลบ/แก้ไขคำถามได้จาก Array นี้ โดยกระจายครบทั้ง 4 แกน E-I, S-N, T-F, J-P
const questions = [
  createQuestion(
    'E-I',
    'เวลาไปงานสังคมที่มีคนแปลกหน้าเยอะๆ คุณมักรู้สึกสนุกและได้ชาร์จพลัง',
    { strong: 'ใช่เลย! ยิ่งคนเยอะยิ่งมีไฟ', soft: 'ค่อนข้างใช่ ได้คุยแล้วสดชื่น' },
    { soft: 'ไม่ค่อยใช่ ต้องใช้พลังเยอะ', strong: 'ไม่ใช่เลย ชอบพื้นที่เงียบๆ มากกว่า' },
  ),
  createQuestion(
    'E-I',
    'เมื่อมีไอเดียใหม่ คุณมักเล่าให้คนอื่นฟังก่อนเพื่อช่วยคิดต่อ',
    { strong: 'เห็นด้วยมาก คุยแล้วไอเดียชัดขึ้น', soft: 'ค่อนข้างเห็นด้วย' },
    { soft: 'ค่อนข้างไม่ใช่ ขอคิดเองก่อน', strong: 'ไม่ใช่เลย ต้องตกผลึกคนเดียวก่อน' },
  ),
  createQuestion(
    'E-I',
    'วันหยุดที่ดีสำหรับคุณคือการออกไปเจอผู้คนหรือทำกิจกรรมข้างนอก',
    { strong: 'ใช่ที่สุด อยากออกไปหาแรงบันดาลใจ', soft: 'ค่อนข้างใช่' },
    { soft: 'ค่อนข้างไม่ใช่ อยู่บ้านก็พอใจ', strong: 'ไม่ใช่เลย ชอบพักเงียบๆ ในโลกของตัวเอง' },
  ),
  createQuestion(
    'E-I',
    'คุณมักเริ่มบทสนทนากับคนใหม่ๆ ได้ไม่ยาก',
    { strong: 'ใช่เลย เปิดบทสนทนาได้ไว', soft: 'ค่อนข้างใช่ ถ้าบรรยากาศโอเค' },
    { soft: 'ค่อนข้างไม่ใช่ ต้องใช้เวลาวอร์ม', strong: 'ไม่ใช่เลย มักรอให้อีกฝ่ายเริ่มก่อน' },
  ),
  createQuestion(
    'E-I',
    'การประชุมแบบระดมสมองทำให้คุณคิดได้เร็วขึ้น',
    { strong: 'เห็นด้วยมาก พลังกลุ่มช่วยได้', soft: 'ค่อนข้างเห็นด้วย' },
    { soft: 'ค่อนข้างไม่เห็นด้วย ต้องมีเวลาคิดเงียบๆ', strong: 'ไม่เห็นด้วยเลย คิดเดี่ยวๆ ได้ดีที่สุด' },
  ),
  createQuestion(
    'E-I',
    'หลังจากเข้าสังคมหลายชั่วโมง คุณยังอยากคุยต่อได้อีก',
    { strong: 'ใช่เลย ยังไปต่อได้', soft: 'ค่อนข้างใช่ ถ้าคนคุยถูกจังหวะ' },
    { soft: 'ค่อนข้างไม่ใช่ เริ่มอยากพัก', strong: 'ไม่ใช่เลย แบตหมดเร็วมาก' },
  ),
  createQuestion(
    'E-I',
    'คุณมักแสดงความคิดออกมาระหว่างกำลังคิด ไม่ได้รอให้สมบูรณ์ก่อน',
    { strong: 'ใช่เลย คิดไปพูดไป', soft: 'ค่อนข้างใช่' },
    { soft: 'ค่อนข้างไม่ใช่ ขอเรียบเรียงก่อน', strong: 'ไม่ใช่เลย พูดเมื่อมั่นใจแล้วเท่านั้น' },
  ),
  createQuestion(
    'E-I',
    'คุณรู้สึกสบายใจกับการเป็นจุดสนใจในบางสถานการณ์',
    { strong: 'เห็นด้วยมาก รับมือได้สบาย', soft: 'ค่อนข้างเห็นด้วย' },
    { soft: 'ค่อนข้างไม่เห็นด้วย รู้สึกเกร็งบ้าง', strong: 'ไม่เห็นด้วยเลย ไม่ชอบเป็นเป้าสายตา' },
  ),
  createQuestion(
    'S-N',
    'คุณเชื่อข้อมูลที่จับต้องได้และรายละเอียดจริงมากกว่าแนวคิดที่ยังพิสูจน์ไม่ได้',
    { strong: 'ใช่เลย ต้องมีหลักฐานชัด', soft: 'ค่อนข้างใช่' },
    { soft: 'ค่อนข้างไม่ใช่ ชอบมองความเป็นไปได้', strong: 'ไม่ใช่เลย ไอเดียใหม่สำคัญกว่ารายละเอียดเดิม' },
  ),
  createQuestion(
    'S-N',
    'เวลาทำงาน คุณชอบขั้นตอนที่ชัดเจนมากกว่าการลองวิธีใหม่ตลอดเวลา',
    { strong: 'เห็นด้วยมาก ขั้นตอนชัดทำให้งานนิ่ง', soft: 'ค่อนข้างเห็นด้วย' },
    { soft: 'ค่อนข้างไม่เห็นด้วย ชอบเปิดทางทดลอง', strong: 'ไม่เห็นด้วยเลย อยากพลิกวิธีใหม่เสมอ' },
  ),
  createQuestion(
    'S-N',
    'คุณมักสังเกตรายละเอียดเล็กๆ ในสถานการณ์รอบตัวได้เร็ว',
    { strong: 'ใช่เลย รายละเอียดไม่ค่อยหลุดสายตา', soft: 'ค่อนข้างใช่' },
    { soft: 'ค่อนข้างไม่ใช่ มักมองภาพรวมก่อน', strong: 'ไม่ใช่เลย สนใจแพตเทิร์นใหญ่ๆ มากกว่า' },
  ),
  createQuestion(
    'S-N',
    'คุณสนุกกับการคุยเรื่องความเป็นไปได้ในอนาคต แม้ตอนนี้ยังไม่มีข้อมูลครบ',
    { strong: 'ไม่ใช่เลย ขออยู่กับสิ่งที่ชัดก่อน', soft: 'ค่อนข้างไม่ใช่' },
    { soft: 'ค่อนข้างใช่ ชอบคิดต่อยอด', strong: 'ใช่ที่สุด อนาคตและความเป็นไปได้คือของโปรด' },
  ),
  createQuestion(
    'S-N',
    'เมื่อเรียนรู้สิ่งใหม่ คุณอยากเห็นตัวอย่างจริงก่อนทฤษฎี',
    { strong: 'ใช่เลย เห็นของจริงแล้วเข้าใจไว', soft: 'ค่อนข้างใช่' },
    { soft: 'ค่อนข้างไม่ใช่ ทฤษฎีช่วยให้เห็นระบบ', strong: 'ไม่ใช่เลย ขอเข้าใจแนวคิดใหญ่ก่อน' },
  ),
  createQuestion(
    'S-N',
    'คุณมักเชื่อประสบการณ์ที่ผ่านมาในการตัดสินใจ',
    { strong: 'เห็นด้วยมาก ประสบการณ์คือฐานที่ดี', soft: 'ค่อนข้างเห็นด้วย' },
    { soft: 'ค่อนข้างไม่เห็นด้วย บริบทใหม่อาจต้องคิดใหม่', strong: 'ไม่เห็นด้วยเลย ชอบหาความเป็นไปได้ใหม่ก่อน' },
  ),
  createQuestion(
    'S-N',
    'คุณชอบคำอธิบายที่เป็นรูปธรรมมากกว่าคำเปรียบเทียบเชิงนามธรรม',
    { strong: 'ใช่เลย ชัดๆ ตรงๆ ดีที่สุด', soft: 'ค่อนข้างใช่' },
    { soft: 'ค่อนข้างไม่ใช่ เปรียบเทียบช่วยเปิดภาพ', strong: 'ไม่ใช่เลย ชอบความหมายซ้อนและมุมมองลึกๆ' },
  ),
  createQuestion(
    'S-N',
    'คุณมักเชื่อมโยงเรื่องเล็กๆ ไปเป็นภาพใหญ่หรือความหมายที่ซ่อนอยู่',
    { strong: 'ไม่ค่อยใช่ ฉันโฟกัสสิ่งที่เกิดขึ้นตรงหน้า', soft: 'ค่อนข้างไม่ใช่' },
    { soft: 'ค่อนข้างใช่ เห็นแพตเทิร์นได้บ่อย', strong: 'ใช่เลย สมองเชื่อมจุดตลอดเวลา' },
  ),
  createQuestion(
    'T-F',
    'เมื่อต้องตัดสินใจยากๆ คุณให้ความสำคัญกับเหตุผลและความยุติธรรมมาก่อนความรู้สึก',
    { strong: 'เห็นด้วยมาก หลักการต้องชัด', soft: 'ค่อนข้างเห็นด้วย' },
    { soft: 'ค่อนข้างไม่เห็นด้วย ความรู้สึกคนเกี่ยวข้องสำคัญมาก', strong: 'ไม่เห็นด้วยเลย ต้องดูผลกระทบทางใจเป็นอันดับแรก' },
  ),
  createQuestion(
    'T-F',
    'คุณบอก Feedback แบบตรงไปตรงมา แม้อาจทำให้อีกฝ่ายไม่สบายใจเล็กน้อย',
    { strong: 'ใช่เลย ตรงและชัดคือการช่วย', soft: 'ค่อนข้างใช่' },
    { soft: 'ค่อนข้างไม่ใช่ จะเลือกคำอย่างระวัง', strong: 'ไม่ใช่เลย ความสัมพันธ์และกำลังใจต้องมาก่อน' },
  ),
  createQuestion(
    'T-F',
    'เวลามีความขัดแย้ง คุณพยายามหาข้อสรุปที่สมเหตุสมผลมากกว่าทำให้ทุกคนรู้สึกดีทันที',
    { strong: 'เห็นด้วยมาก ต้องแก้ที่เหตุผล', soft: 'ค่อนข้างเห็นด้วย' },
    { soft: 'ค่อนข้างไม่เห็นด้วย บรรยากาศสำคัญ', strong: 'ไม่เห็นด้วยเลย ต้องเยียวยาความรู้สึกก่อน' },
  ),
  createQuestion(
    'T-F',
    'คุณตัดสินคนจากความตั้งใจและบริบทส่วนตัวมากกว่าผลลัพธ์ที่ออกมา',
    { strong: 'ไม่ใช่เลย ผลลัพธ์และมาตรฐานต้องมาก่อน', soft: 'ค่อนข้างไม่ใช่' },
    { soft: 'ค่อนข้างใช่ บริบทมีผลมาก', strong: 'ใช่เลย ความตั้งใจและหัวใจสำคัญที่สุด' },
  ),
  createQuestion(
    'T-F',
    'คุณสบายใจกับการวิเคราะห์ข้อดีข้อเสียแบบเย็นๆ ก่อนตัดสินใจ',
    { strong: 'ใช่เลย ยิ่งชัดยิ่งดี', soft: 'ค่อนข้างใช่' },
    { soft: 'ค่อนข้างไม่ใช่ ต้องถามใจตัวเองด้วย', strong: 'ไม่ใช่เลย ความรู้สึกบอกทิศทางได้ดีมาก' },
  ),
  createQuestion(
    'T-F',
    'คุณมักรับรู้อารมณ์ของคนรอบตัวได้ไวและปรับตัวตามบรรยากาศ',
    { strong: 'ไม่ค่อยใช่ ฉันโฟกัสเนื้อหาและเหตุผลก่อน', soft: 'ค่อนข้างไม่ใช่' },
    { soft: 'ค่อนข้างใช่ จับบรรยากาศได้', strong: 'ใช่เลย อ่านอารมณ์ห้องได้เร็วมาก' },
  ),
  createQuestion(
    'T-F',
    'เมื่อเพื่อนมีปัญหา คุณมักช่วยวิเคราะห์ทางออกก่อนปลอบใจ',
    { strong: 'ใช่เลย หาทางแก้คือช่วยจริง', soft: 'ค่อนข้างใช่' },
    { soft: 'ค่อนข้างไม่ใช่ ต้องรับฟังก่อน', strong: 'ไม่ใช่เลย อยู่ข้างๆ และเข้าใจเขาก่อนเสมอ' },
  ),
  createQuestion(
    'J-P',
    'คุณชอบวางแผนล่วงหน้าและรู้ว่าต้องทำอะไรเป็นลำดับ',
    { strong: 'ใช่เลย แผนชัดทำให้สบายใจ', soft: 'ค่อนข้างใช่' },
    { soft: 'ค่อนข้างไม่ใช่ ชอบเหลือพื้นที่ยืดหยุ่น', strong: 'ไม่ใช่เลย ด้นสดตามสถานการณ์สนุกกว่า' },
  ),
  createQuestion(
    'J-P',
    'คุณรู้สึกโล่งใจเมื่อปิดงานได้ก่อนเดดไลน์',
    { strong: 'เห็นด้วยมาก ปิดเร็วแล้วใจนิ่ง', soft: 'ค่อนข้างเห็นด้วย' },
    { soft: 'ค่อนข้างไม่เห็นด้วย ไฟมักมาตอนใกล้เส้นตาย', strong: 'ไม่เห็นด้วยเลย เดดไลน์คือแรงขับหลักของฉัน' },
  ),
  createQuestion(
    'J-P',
    'ถ้าแผนเปลี่ยนกะทันหัน คุณมักรู้สึกเสียจังหวะ',
    { strong: 'ใช่เลย ต้องตั้งหลักใหม่', soft: 'ค่อนข้างใช่' },
    { soft: 'ค่อนข้างไม่ใช่ ปรับได้อยู่', strong: 'ไม่ใช่เลย เปลี่ยนแผนก็เป็นสีสัน' },
  ),
  createQuestion(
    'J-P',
    'คุณชอบเปิดตัวเลือกไว้ให้นานที่สุดก่อนตัดสินใจ',
    { strong: 'ไม่ใช่เลย ตัดสินใจเร็วแล้วเดินหน้า', soft: 'ค่อนข้างไม่ใช่' },
    { soft: 'ค่อนข้างใช่ รอดูข้อมูลเพิ่มก่อน', strong: 'ใช่เลย ยิ่งมีทางเลือกยิ่งดี' },
  ),
  createQuestion(
    'J-P',
    'โต๊ะทำงานหรือไฟล์งานของคุณมักมีระบบที่คุณตั้งใจจัดไว้',
    { strong: 'ใช่เลย ทุกอย่างมีที่ของมัน', soft: 'ค่อนข้างใช่' },
    { soft: 'ค่อนข้างไม่ใช่ เป็นระเบียบแบบเฉพาะตัว', strong: 'ไม่ใช่เลย ขอให้หาเจอก็พอ' },
  ),
  createQuestion(
    'J-P',
    'คุณสนุกกับการแก้ปัญหาเฉพาะหน้าและเปลี่ยนทิศทางตามข้อมูลใหม่',
    { strong: 'ไม่ค่อยใช่ ฉันชอบเตรียมให้พร้อมก่อน', soft: 'ค่อนข้างไม่ใช่' },
    { soft: 'ค่อนข้างใช่ ปรับตามสถานการณ์ได้ดี', strong: 'ใช่เลย ยิ่งสดยิ่งท้าทาย' },
  ),
  createQuestion(
    'J-P',
    'ก่อนเริ่มโปรเจกต์ คุณอยากกำหนดเป้าหมาย ขอบเขต และเวลาส่งให้ชัดเจน',
    { strong: 'เห็นด้วยมาก ชัดก่อนค่อยเริ่ม', soft: 'ค่อนข้างเห็นด้วย' },
    { soft: 'ค่อนข้างไม่เห็นด้วย เริ่มก่อนแล้วค่อยปรับก็ได้', strong: 'ไม่เห็นด้วยเลย อยากสำรวจระหว่างทางมากกว่า' },
  ),
];

const mbtiProfiles = {
  INTJ: { title: 'The Strategic Visionary', desc: 'นักวางระบบที่มองไกล ชอบสร้างแผนที่มีเหตุผลและเป้าหมายชัดเจน', mood: 'วางหมากเงียบๆ แต่เห็นปลายทางก่อนใคร', tags: ['#VisionBuilder', '#DeepFocus', '#FutureReady'] },
  INTP: { title: 'The Curious Architect', desc: 'นักคิดอิสระที่สนุกกับการแยกชิ้นส่วนความคิดเพื่อเข้าใจแก่นแท้', mood: 'โลกคือห้องทดลอง และทุกคำถามมีประตูซ่อนอยู่', tags: ['#IdeaLab', '#LogicLover', '#QuietGenius'] },
  ENTJ: { title: 'The Bold Commander', desc: 'ผู้นำสายผลักดันที่เห็นภาพใหญ่ วางหมากไว และพาทีมไปถึงเป้าหมาย', mood: 'เห็นเส้นทางแล้วพร้อมพาทุกคนออกเดินทันที', tags: ['#LeadTheWay', '#PowerPlanner', '#GoalGetter'] },
  ENTP: { title: 'The Spark Challenger', desc: 'นักตั้งคำถามผู้ชอบไอเดียสดใหม่ มองเห็นทางเลือกที่คนอื่นยังไม่ทันคิด', mood: 'จุดประกายบทสนทนาให้ธรรมดากลายเป็นสนามไอเดีย', tags: ['#BrainstormMode', '#RuleBreaker', '#QuickWit'] },
  INFJ: { title: 'The Gentle Oracle', desc: 'ผู้เข้าใจความหมายลึกๆ ของผู้คนและอยากสร้างผลลัพธ์ที่มีคุณค่าต่อใจ', mood: 'อ่านระหว่างบรรทัดเก่ง และพาความหมายกลับมาส่องทาง', tags: ['#InsightfulSoul', '#PurposeDriven', '#SoftPower'] },
  INFP: { title: 'The Dream Weaver', desc: 'นักฝันที่จริงใจกับคุณค่าข้างใน มีจินตนาการสูงและเห็นความงามในรายละเอียดทางใจ', mood: 'ถือเข็มทิศหัวใจไว้แน่น แล้วเดินตามความหมายของตัวเอง', tags: ['#HeartCompass', '#CreativeSoul', '#MeaningMaker'] },
  ENFJ: { title: 'The Warm Catalyst', desc: 'ผู้ปลุกพลังคนรอบตัว เก่งในการเชื่อมใจและพาทุกคนเติบโตไปด้วยกัน', mood: 'ทำให้คนรอบตัวรู้สึกถูกเห็น และอยากเป็นตัวเองเวอร์ชันที่ดีขึ้น', tags: ['#PeopleMagic', '#GlowLeader', '#GrowthGuide'] },
  ENFP: { title: 'The Radiant Explorer', desc: 'พลังสดใสที่รักความเป็นไปได้ใหม่ๆ เชื่อมโยงคน ไอเดีย และแรงบันดาลใจได้เก่ง', mood: 'ตามกลิ่นไอเดียใหม่ไปเรื่อยๆ แล้วเจอเรื่องน่าตื่นเต้นเสมอ', tags: ['#FreeSpirit', '#IdeaSpark', '#JoyHunter'] },
  ISTJ: { title: 'The Steady Guardian', desc: 'คนรับผิดชอบสูง เชื่อถือได้ ทำงานเป็นระบบ และใส่ใจมาตรฐานที่จับต้องได้', mood: 'นิ่ง หนักแน่น และเป็นจุดที่คนอื่นวางใจได้', tags: ['#ReliableCore', '#DetailKeeper', '#QuietStrength'] },
  ISFJ: { title: 'The Tender Protector', desc: 'ผู้ดูแลที่อบอุ่นและละเอียดอ่อน จำรายละเอียดของคนสำคัญได้ดีเสมอ', mood: 'ความใส่ใจเล็กๆ ของคุณทำให้พื้นที่รอบตัวอ่อนโยนขึ้น', tags: ['#CareCraft', '#LoyalHeart', '#GentleDetail'] },
  ESTJ: { title: 'The Practical Captain', desc: 'นักจัดการตัวจริง ชอบความชัดเจน ลงมือไว และทำให้สิ่งต่างๆ เดินหน้าเป็นรูปธรรม', mood: 'จัดระบบจากความวุ่นวาย แล้วเปลี่ยนแผนให้กลายเป็นผลลัพธ์', tags: ['#GetItDone', '#ClearOrder', '#ActionLead'] },
  ESFJ: { title: 'The Social Nurturer', desc: 'คนสร้างบรรยากาศที่อบอุ่น ใส่ใจความต้องการของคนรอบตัวและทำให้ทีมกลมเกลียว', mood: 'รู้จังหวะของผู้คน และทำให้ทุกวงสนทนาดูอบอุ่นขึ้น', tags: ['#WarmCircle', '#TeamHeart', '#CareEnergy'] },
  ISTP: { title: 'The Calm Fixer', desc: 'นักแก้ปัญหาใจนิ่ง ชอบลงมือทดลอง เข้าใจระบบผ่านการสัมผัสของจริง', mood: 'พูดน้อยแต่แก้ไว เห็นกลไกแล้วรู้ว่าจะเริ่มจากตรงไหน', tags: ['#HandsOn', '#CoolMind', '#SkillMode'] },
  ISFP: { title: 'The Soft Artisan', desc: 'ศิลปินผู้เงียบลึก รักอิสระและแสดงตัวตนผ่านรสนิยม การกระทำ และความรู้สึกจริง', mood: 'ปล่อยความจริงใจออกมาเป็นรสนิยม สีสัน และจังหวะเฉพาะตัว', tags: ['#AestheticSoul', '#TrueFeel', '#QuietCharm'] },
  ESTP: { title: 'The Live Wire', desc: 'นักลุยที่อ่านสถานการณ์ไว ชอบความท้าทายและตัดสินใจจากจังหวะตรงหน้า', mood: 'อ่านเกมสดได้ไว และทำให้จังหวะตอนนี้มีพลังขึ้นมา', tags: ['#NowEnergy', '#BoldMove', '#StreetSmart'] },
  ESFP: { title: 'The Bright Performer', desc: 'ผู้เติมสีสันให้ทุกพื้นที่ อยู่กับปัจจุบันเก่ง และทำให้ชีวิตรอบตัวมีชีวา', mood: 'อยู่ตรงไหน ตรงนั้นก็ดูมีชีวิต มีเสียงหัวเราะ และมีแสงขึ้นมา', tags: ['#GoodVibes', '#MomentMaker', '#BrightHeart'] },
};

const mbtiStories = {
  INTJ: { vibe: 'คิดเป็นระบบ มองเกมยาว และไม่ค่อยเสียเวลาให้สิ่งที่ไม่มีเหตุผลชัดเจน', friction: 'มักเหนื่อยกับคนที่เปลี่ยนใจบ่อย ดราม่าเก่ง หรือไม่เคารพแผนที่ตกลงกันไว้', matches: ['ENFP', 'ENTP'] },
  INTP: { vibe: 'ชอบสำรวจไอเดียลึกๆ มีโลกความคิดของตัวเอง และซื่อสัตย์กับความจริงมากกว่าความนิยม', friction: 'ไม่ค่อยถูกกับคนที่เร่งให้สรุปเร็วเกินไป หรือไม่เปิดพื้นที่ให้ตั้งคำถาม', matches: ['ENTJ', 'ENFJ'] },
  ENTJ: { vibe: 'ชัดเจน เด็ดขาด เห็นเป้าหมายไว และมีพลังในการพาคนรอบตัวเดินหน้า', friction: 'อาจชนกับคนที่ไม่รับผิดชอบ เลี่ยงการตัดสินใจ หรือวนอยู่กับปัญหาเดิมนานๆ', matches: ['INTP', 'INFP'] },
  ENTP: { vibe: 'หัวไว สนุกกับการท้าทายกรอบเดิม และเปลี่ยนบทสนทนาธรรมดาให้มีประกายได้เสมอ', friction: 'มักไม่ถูกกับคนที่ปิดกั้นไอเดียเร็วเกินไป หรือยึดกฎจนไม่มีพื้นที่ทดลอง', matches: ['INFJ', 'INTJ'] },
  INFJ: { vibe: 'ลึกซึ้ง อ่อนโยน มีสัญชาตญาณกับผู้คน และต้องการความสัมพันธ์ที่มีความหมายจริง', friction: 'เหนื่อยกับคนที่ไม่จริงใจ พูดอย่างทำอย่าง หรือมองข้ามความรู้สึกละเอียดอ่อน', matches: ['ENTP', 'ENFP'] },
  INFP: { vibe: 'จริงใจกับคุณค่าข้างใน จินตนาการสูง และมักเข้าใจอารมณ์ที่คนอื่นอธิบายไม่ออก', friction: 'ไม่ค่อยถูกกับคนที่เย็นชาจนไม่ฟังใจ หรือบังคับให้ทิ้งตัวตนเพื่อเข้ากรอบ', matches: ['ENFJ', 'ENTJ'] },
  ENFJ: { vibe: 'อบอุ่น อ่านบรรยากาศเก่ง และมีพรสวรรค์ในการทำให้คนอื่นรู้สึกมีคุณค่า', friction: 'มักเหนื่อยกับคนที่ปิดใจ ไม่สื่อสาร หรือรับพลังดูแลไปโดยไม่เห็นคุณค่า', matches: ['INFP', 'INTP'] },
  ENFP: { vibe: 'สดใส ช่างเชื่อมโยง รักความเป็นไปได้ และมักพาคนรอบตัวเห็นโลกมุมใหม่', friction: 'ไม่ถูกกับคนที่ควบคุมมากเกินไป หรือทำให้ทุกไอเดียกลายเป็นข้อจำกัดทันที', matches: ['INTJ', 'INFJ'] },
  ISTJ: { vibe: 'มั่นคง รับผิดชอบสูง เชื่อถือได้ และใส่ใจรายละเอียดที่ทำให้งานออกมาดีจริง', friction: 'อาจไม่ถูกกับคนที่รับปากง่ายแต่ไม่ทำ หรือเปลี่ยนแผนโดยไม่มีเหตุผล', matches: ['ESFP', 'ESTP'] },
  ISFJ: { vibe: 'ใส่ใจ อ่อนโยน จำรายละเอียดของคนสำคัญได้ดี และดูแลความสัมพันธ์อย่างสม่ำเสมอ', friction: 'เหนื่อยกับคนที่พูดแรงเกินจำเป็น เห็นแก่ตัว หรือไม่เคารพความตั้งใจเล็กๆ', matches: ['ESFP', 'ESTP'] },
  ESTJ: { vibe: 'จัดการเก่ง ตรงไปตรงมา รักความชัดเจน และเปลี่ยนแผนให้เป็นผลลัพธ์ได้จริง', friction: 'มักชนกับคนที่ไม่ตรงเวลา ไม่รับผิดชอบ หรือปล่อยให้เรื่องง่ายกลายเป็นเรื่องวุ่น', matches: ['ISFP', 'ISTP'] },
  ESFJ: { vibe: 'เป็นศูนย์กลางความอบอุ่นของกลุ่ม ใส่ใจผู้คน และทำให้ทุกคนรู้สึกเป็นส่วนหนึ่ง', friction: 'ไม่ค่อยถูกกับคนที่ไม่รักษาน้ำใจ เมินความพยายาม หรือทำตัวห่างเหินเกินไป', matches: ['ISFP', 'ISTP'] },
  ISTP: { vibe: 'ใจนิ่ง ลุยเป็นจังหวะ แก้ปัญหาด้วยมือจริง และชอบอิสระในการเลือกวิธีของตัวเอง', friction: 'อาจอึดอัดกับคนที่ถามความรู้สึกถี่เกินไป หรือจัดตารางชีวิตให้แน่นเกินจำเป็น', matches: ['ESFJ', 'ESTJ'] },
  ISFP: { vibe: 'มีรสนิยม อ่อนโยน รักอิสระ และแสดงตัวตนผ่านการกระทำมากกว่าคำพูดเยอะๆ', friction: 'ไม่ถูกกับคนที่วิจารณ์แรง ควบคุมทุกอย่าง หรือไม่ให้พื้นที่กับความรู้สึกส่วนตัว', matches: ['ENFJ', 'ESFJ'] },
  ESTP: { vibe: 'อ่านสถานการณ์ไว กล้าลอง กล้าตัดสินใจ และมีพลังกับสิ่งที่เกิดขึ้นตรงหน้า', friction: 'ไม่ค่อยถูกกับคนที่คิดวนมากเกินไป หรือทำให้ทุกอย่างช้าด้วยความกังวล', matches: ['ISFJ', 'ISTJ'] },
  ESFP: { vibe: 'มีชีวิตชีวา อยู่กับปัจจุบันเก่ง และเติมสีสันให้พื้นที่รอบตัวแบบเป็นธรรมชาติ', friction: 'มักเหนื่อยกับคนที่จริงจังตลอดเวลา วิจารณ์บ่อย หรือไม่ยอมสนุกกับจังหวะตรงหน้า', matches: ['ISFJ', 'ISTJ'] },
};

const exportVariants = [
  { id: 'aura', label: 'Aura Story', desc: 'สีสด มีแสงและกริด เหมาะแชร์ลง IG Story' },
  { id: 'clean', label: 'Clean Poster', desc: 'เรียบ สว่าง อ่านง่าย เหมาะส่งให้เพื่อน' },
  { id: 'character', label: 'Character Focus', desc: 'โชว์ตัวละครเด่นที่สุด เหมาะสายภาพ' },
  { id: 'match', label: 'Match Duo', desc: 'เน้นคู่ MBTI ที่เข้ากัน พร้อมรูปคู่' },
];

const exportFormats = [
  { id: 'png', label: 'PNG', mime: 'image/png', extension: 'png', quality: 1, backgroundColor: null },
  { id: 'jpg', label: 'JPG', mime: 'image/jpeg', extension: 'jpg', quality: 0.96, backgroundColor: '#1746a2' },
];

const initialScores = scoreLetters.reduce((scores, letter) => ({ ...scores, [letter]: 0 }), {});

function getStoredTheme() {
  if (typeof window === 'undefined') return 'light';
  return localStorage.getItem('discover-vibe-theme') || 'light';
}

function calculateType(scores) {
  return axisPairs.map(([left, right]) => (scores[left] >= scores[right] ? left : right)).join('');
}

function getCharacterImagePath(type) {
  return `/characters/${type}.png`;
}

function usePlaceholderImage(event) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = '/characters/_placeholder.svg';
}

function getMatchProfiles(type) {
  return mbtiStories[type].matches.map((matchType) => ({
    type: matchType,
    ...mbtiProfiles[matchType],
    image: getCharacterImagePath(matchType),
  }));
}

function getStoryPreviewScale() {
  if (typeof window === 'undefined') return 0.32;

  const widthScale = (window.innerWidth - 56) / 1080;
  const heightScale = (window.innerHeight * 0.78) / 1920;
  const desktopScale = Math.min(widthScale, heightScale, 0.36);

  if (window.innerWidth <= 840) {
    const mobileWidthScale = (window.innerWidth - 32) / 1080;
    const mobileHeightScale = (window.innerHeight * 0.62) / 1920;
    return Math.max(0.18, Math.min(mobileWidthScale, mobileHeightScale));
  }

  return Math.max(0.24, desktopScale);
}

export default function App() {
  const [theme, setTheme] = useState(getStoredTheme);
  const [screen, setScreen] = useState('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState(initialScores);
  const [isDownloading, setIsDownloading] = useState(false);
  const [storyScale, setStoryScale] = useState(getStoryPreviewScale);
  const [selectedExportVariant, setSelectedExportVariant] = useState('aura');
  const [selectedExportFormat, setSelectedExportFormat] = useState('png');

  const activeQuestion = questions[Math.min(currentQuestion, questions.length - 1)];
  const resultType = useMemo(() => calculateType(scores), [scores]);
  const profile = mbtiProfiles[resultType];
  const story = mbtiStories[resultType];
  const matchProfiles = getMatchProfiles(resultType);
  const characterImagePath = getCharacterImagePath(resultType);
  const selectedExportFormatConfig = exportFormats.find((format) => format.id === selectedExportFormat) || exportFormats[0];
  const axisBreakdown = axisPairs.map(([left, right]) => {
    const total = scores[left] + scores[right];
    const leftPercent = total === 0 ? 50 : Math.round((scores[left] / total) * 100);

    return { left, right, leftPercent, rightPercent: 100 - leftPercent };
  });
  const progressPercent = (Math.min(currentQuestion + 1, questions.length) / questions.length) * 100;
  const storyPreviewStyle = {
    width: `${1080 * storyScale}px`,
    height: `${1920 * storyScale}px`,
    '--story-scale': storyScale,
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('discover-vibe-theme', theme);
  }, [theme]);

  useEffect(() => {
    function updateStoryScale() {
      setStoryScale(getStoryPreviewScale());
    }

    updateStoryScale();
    window.addEventListener('resize', updateStoryScale);
    return () => window.removeEventListener('resize', updateStoryScale);
  }, []);

  function startQuiz() {
    setScreen('quiz');
    setCurrentQuestion(0);
    setScores(initialScores);
  }

  function answerQuestion(option) {
    setScores((previousScores) => ({
      ...previousScores,
      [option.type]: previousScores[option.type] + option.weight,
    }));

    if (currentQuestion >= questions.length - 1) {
      setScreen('result');
      return;
    }

    setCurrentQuestion((questionIndex) => Math.min(questionIndex + 1, questions.length - 1));
  }

  function restartQuiz() {
    setScreen('start');
    setCurrentQuestion(0);
    setScores(initialScores);
  }

  async function downloadStoryCard() {
    const storyCard = document.getElementById('story-card');
    let clone;

    if (!storyCard) {
      alert('ไม่พบการ์ดผลลัพธ์ กรุณาลองอีกครั้ง');
      return;
    }

    setIsDownloading(true);

    try {
      // สร้างสำเนาแบบไม่ย่อ (scale=1) นอกจอเพื่อให้ได้รูป 1080x1920 เต็มสัดส่วน
      clone = storyCard.cloneNode(true);
      clone.id = 'story-card-export';
      clone.classList.add('story-card-export');
      clone.style.position = 'fixed';
      clone.style.left = '-100000px';
      clone.style.top = '0';
      clone.style.width = '1080px';
      clone.style.height = '1920px';
      clone.style.setProperty('--story-scale', '1');
      // ใส่ชั้นพื้นหลังสำรองสำหรับ export เพื่อกันเคสบราวเซอร์ไม่รองรับเอฟเฟกต์บางอย่าง
      const exportBg = document.createElement('div');
      exportBg.className = 'export-bg';
      clone.insertBefore(exportBg, clone.firstChild);
      document.body.appendChild(clone);

      // รอให้ browser วาด DOM clone ก่อนแคปเจอร์
      await new Promise((r) => requestAnimationFrame(r));

      const canvas = await html2canvas(clone, {
        width: 1080,
        height: 1920,
        scale: 1,
        useCORS: true,
        backgroundColor: selectedExportFormatConfig.backgroundColor,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `discover-your-vibe-${resultType}-${selectedExportVariant}.${selectedExportFormatConfig.extension}`;
      link.href = canvas.toDataURL(selectedExportFormatConfig.mime, selectedExportFormatConfig.quality);
      link.click();
    } finally {
      // ลบ clone ออกหลังจากสร้างรูปแล้ว แม้ export จะล้มเหลวระหว่างทาง
      clone?.remove();
      setIsDownloading(false);
    }
  }

  return (
    <main className="app-shell">
      <button className="theme-toggle" type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle color mode">
        <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} aria-hidden="true" />
      </button>

      {screen === 'start' && (
        <section className="screen start-screen glass-panel fade-in">
          <div className="brand-mark" aria-hidden="true">
            <FontAwesomeIcon icon={faWandMagicSparkles} />
          </div>
          <p className="eyebrow">MBTI 16 Types Quiz</p>
          <h1>Discover Your Vibe</h1>
          <p className="lead">ตอบ 30 คำถามสั้นๆ เพื่อค้นหาบุคลิกภาพในแบบของคุณ พร้อมการ์ด IG Story สำหรับแชร์ผลลัพธ์</p>
          <button className="primary-button start-button" type="button" onClick={startQuiz}>
            <FontAwesomeIcon icon={faPlay} aria-hidden="true" />
            เริ่มทำแบบทดสอบ
          </button>
        </section>
      )}

      {screen === 'quiz' && (
        <section className="screen quiz-screen glass-panel fade-in">
          <div className="quiz-topline">
            <span>ข้อ {currentQuestion + 1}/{questions.length}</span>
            <span>{activeQuestion.axis}</span>
          </div>
          <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="quiz-grid">
            <article className="question-copy">
              <p className="eyebrow">เลือกคำตอบที่ใกล้กับคุณที่สุด</p>
              <h2>{activeQuestion.q}</h2>
            </article>

            <div className="answer-stack">
              {activeQuestion.options.map((option) => (
                <button className="answer-button" type="button" key={option.text} onClick={() => answerQuestion(option)}>
                  <span>{option.text}</span>
                  <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {screen === 'result' && (
        <section className="screen result-screen fade-in">
          <div className="story-preview" style={storyPreviewStyle} aria-label="IG Story result preview">
            <div id="story-card" className={`story-card-${selectedExportVariant}`}>
              <div className="story-pattern" aria-hidden="true" />
              <div className="story-frame">
                <div className="story-label-row">
                  <span>Discover Your Vibe</span>
                  <span>MBTI Result</span>
                </div>
                <div className="story-character-card">
                  <img src={characterImagePath} onError={usePlaceholderImage} alt={`${resultType} character`} />
                </div>
                <div className="story-match-portraits" aria-label="MBTI match characters">
                  {matchProfiles.map((match) => (
                    <div key={match.type}>
                      <img src={match.image} onError={usePlaceholderImage} alt={`${match.type} character`} />
                      <span>{match.type}</span>
                    </div>
                  ))}
                </div>
                <div className="story-copy-block">
                  <div className="story-type">{resultType}</div>
                  <h2>{profile.title}</h2>
                  <p className="story-desc">{profile.desc}</p>
                  <p className="story-mood">{profile.mood}</p>
                </div>
                <div className="story-match-strip">
                  <span>Best Match</span>
                  <strong>{matchProfiles.map((match) => match.type).join(' / ')}</strong>
                </div>
                <div className="story-tags">
                  {profile.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <p className="story-watermark">@ Discover Your Vibe</p>
              </div>
            </div>
          </div>

          <aside className="result-actions glass-panel">
            <p className="eyebrow">ผลลัพธ์ของคุณ</p>
            <h2>ยินดีด้วย คุณคือ {resultType}</h2>
            <p>บันทึกการ์ดนี้ไว้แชร์ลง IG Story หรือเล่นใหม่เพื่อดูว่าคำตอบในอารมณ์อื่นจะพาไปเจอบุคลิกไหน</p>

            <div className="personality-story">
              <div className="story-info-card">
                <span>เป็นคนยังไง</span>
                <p>{story.vibe}</p>
              </div>
              <div className="story-info-card caution">
                <span>ไม่ค่อยถูกกับคนแบบไหน</span>
                <p>{story.friction}</p>
              </div>
            </div>

            

            <div className="axis-card">
              <div className="axis-card-title">
                <FontAwesomeIcon icon={faStar} aria-hidden="true" />
                Energy Map
              </div>
              {axisBreakdown.map((axis) => (
                <div className="axis-row" key={`${axis.left}-${axis.right}`}>
                  <span>{axis.left}</span>
                  <div className="axis-track" aria-label={`${axis.left} ${axis.leftPercent}% ${axis.right} ${axis.rightPercent}%`}>
                    <div style={{ width: `${axis.leftPercent}%` }} />
                  </div>
                  <span>{axis.right}</span>
                </div>
              ))}
            </div>

            <div className="match-section">
              <div className="match-heading">
                <span>MBTI ที่เข้ากัน</span>
                <strong>{resultType} x {matchProfiles.map((match) => match.type).join(' / ')}</strong>
              </div>
              <div className="match-grid">
                {matchProfiles.map((match) => (
                  <article className="match-card" key={match.type}>
                    <img src={match.image} onError={usePlaceholderImage} alt={`${match.type} character`} />
                    <div>
                      <span>{match.type}</span>
                      <strong>{match.title}</strong>
                      <p>{match.mood}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="export-panel">
              <div className="export-panel-head">
                <span>เลือกรูปแบบดาวน์โหลด</span>
                <strong>{selectedExportFormatConfig.label} 1080 x 1920</strong>
              </div>
              <div className="export-style-grid">
                {exportVariants.map((variant) => (
                  <button
                    className={selectedExportVariant === variant.id ? 'export-choice active' : 'export-choice'}
                    type="button"
                    key={variant.id}
                    onClick={() => setSelectedExportVariant(variant.id)}
                  >
                    <span>{variant.label}</span>
                    <small>{variant.desc}</small>
                  </button>
                ))}
              </div>
              <div className="export-format-toggle" aria-label="Image file format">
                {exportFormats.map((format) => (
                  <button
                    className={selectedExportFormat === format.id ? 'active' : ''}
                    type="button"
                    key={format.id}
                    onClick={() => setSelectedExportFormat(format.id)}
                  >
                    {format.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="action-row">
              <button className="primary-button" type="button" onClick={downloadStoryCard} disabled={isDownloading}>
                <FontAwesomeIcon icon={faDownload} aria-hidden="true" />
                {isDownloading ? 'กำลังสร้างรูป...' : 'ดาวน์โหลดรูปเพื่อแชร์ลง IG Story'}
              </button>
              <button className="secondary-button" type="button" onClick={restartQuiz}>
                <FontAwesomeIcon icon={faRotateRight} aria-hidden="true" />
                เล่นใหม่อีกครั้ง
              </button>
            </div>

            <div className="donate-box">
              <div>
                <h3>สนับสนุนค่ากาแฟให้ผู้สร้างสรรค์</h3>
                <p>ขอบคุณที่ช่วยเติมพลังให้โปรเจกต์เล็กๆ นี้เติบโตต่อไป</p>
              </div>
              {/* เปลี่ยน src ด้านล่างเป็นรูป QR Code PromptPay ของคุณ */}
              <img src="https://placehold.co/360x360/png?text=PromptPay+QR" alt="PromptPay QR placeholder" />
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}
