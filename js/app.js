/* ============================================
   App Module — Main Application Logic
   ============================================ */

import { calcSemesterGPA, calcCumulativeGPA, calcTargetGPA, getGPAStatus } from './calculator.js';
import { STORAGE_KEYS, saveData, loadData } from './storage.js';

import { exportToPDF } from './pdf-export.js';

// ── Grade options ──
const GRADE_OPTIONS = [4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0];

// ── State ──
let subjects = [];
let semesters = [];
let subjectIdCounter = 0;
let semesterIdCounter = 0;

// ── DOM References ──
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ════════════════════════════════════════
//  INITIALIZATION
// ════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initTabs();
    initEventListeners();
    initDevNotice();
    initFormulaToggle();
    renderAll();
});

function loadState() {
    subjects = loadData(STORAGE_KEYS.SUBJECTS, []);
    semesters = loadData(STORAGE_KEYS.SEMESTERS, []);

    // Ensure counters are above existing IDs
    if (subjects.length) {
        subjectIdCounter = Math.max(...subjects.map(s => s.id)) + 1;
    }
    if (semesters.length) {
        semesterIdCounter = Math.max(...semesters.map(s => s.id)) + 1;
    }

    // Add defaults if empty
    if (subjects.length === 0) {
        addSubject();
        addSubject();
        addSubject();
    }
    if (semesters.length === 0) {
        addSemester();
    }
}

// ════════════════════════════════════════
//  TABS
// ════════════════════════════════════════

function initTabs() {
    $$('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            $$('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            $$('.tab-content').forEach(tc => tc.classList.remove('active'));
            $(`#${target}`).classList.add('active');
        });
    });
}

// ════════════════════════════════════════
//  EVENT LISTENERS
// ════════════════════════════════════════

function initEventListeners() {


    // Add subject
    $('#addSubjectBtn').addEventListener('click', () => {
        addSubject();
        renderSubjects();
        updateGPA();
        persistSubjects();
    });

    // Clear all subjects
    $('#clearSubjectsBtn').addEventListener('click', () => {
        subjects = [];
        subjectIdCounter = 0;
        addSubject();
        renderSubjects();
        updateGPA();
        persistSubjects();
        showToast('🗑️ ล้างข้อมูลแล้ว');
    });

    // Subject list event delegation
    $('#subjectList').addEventListener('input', (e) => {
        const row = e.target.closest('.subject-row');
        if (!row) return;
        const id = parseInt(row.dataset.id);
        const subject = subjects.find(s => s.id === id);
        if (!subject) return;

        if (e.target.classList.contains('subject-name')) {
            subject.name = e.target.value;
        } else if (e.target.classList.contains('subject-credits')) {
            subject.credits = e.target.value;
        } else if (e.target.classList.contains('subject-grade')) {
            subject.grade = e.target.value;
        }

        updateGPA();
        persistSubjects();
    });

    $('#subjectList').addEventListener('click', (e) => {
        if (e.target.closest('.btn-remove')) {
            const row = e.target.closest('.subject-row');
            const id = parseInt(row.dataset.id);
            subjects = subjects.filter(s => s.id !== id);
            if (subjects.length === 0) addSubject();
            renderSubjects();
            updateGPA();
            persistSubjects();
        }
    });

    // Export PDF
    $('#exportPdfBtn').addEventListener('click', () => {
        const content = $('#pdfContent');
        exportToPDF(content, 'Thai_GPA_Report.pdf');
    });

    // ── Cumulative GPA ──
    $('#addSemesterBtn').addEventListener('click', () => {
        addSemester();
        renderSemesters();
        updateCumulativeGPA();
        persistSemesters();
    });

    $('#semesterList').addEventListener('input', () => {
        syncSemesterData();
        updateCumulativeGPA();
        persistSemesters();
    });

    $('#semesterList').addEventListener('click', (e) => {
        if (e.target.closest('.btn-remove')) {
            const row = e.target.closest('.semester-entry');
            const id = parseInt(row.dataset.id);
            semesters = semesters.filter(s => s.id !== id);
            if (semesters.length === 0) addSemester();
            renderSemesters();
            updateCumulativeGPA();
            persistSemesters();
        }
    });

    // ── Target GPA ──
    $('#targetForm').addEventListener('input', updateTargetGPA);

    // Load target from storage
    const targetData = loadData(STORAGE_KEYS.TARGET, {});
    if (targetData.currentGPA) $('#targetCurrentGPA').value = targetData.currentGPA;
    if (targetData.currentCredits) $('#targetCurrentCredits').value = targetData.currentCredits;
    if (targetData.desiredGPA) $('#targetDesiredGPA').value = targetData.desiredGPA;
    if (targetData.nextCredits) $('#targetNextCredits').value = targetData.nextCredits;
    updateTargetGPA();
}

// ════════════════════════════════════════
//  SUBJECTS
// ════════════════════════════════════════

function addSubject() {
    subjects.push({
        id: subjectIdCounter++,
        name: '',
        credits: '',
        grade: '4',
    });
}

function renderSubjects() {
    const list = $('#subjectList');
    list.innerHTML = subjects.map((s, i) => `
    <div class="subject-row" data-id="${s.id}">
      <input type="text" class="subject-name" placeholder="วิชาที่ ${i + 1}" value="${escapeHtml(s.name)}">
      <input type="number" class="subject-credits" placeholder="หน่วยกิต" min="0.5" max="12" step="0.5" value="${s.credits}">
      <select class="subject-grade">
        ${GRADE_OPTIONS.map(g => `<option value="${g}" ${s.grade == g ? 'selected' : ''}>${g.toFixed(1)}</option>`).join('')}
      </select>
      <button class="btn-remove" title="ลบวิชา">✕</button>
    </div>
  `).join('');
}

function persistSubjects() {
    saveData(STORAGE_KEYS.SUBJECTS, subjects);
}

// ════════════════════════════════════════
//  GPA DISPLAY
// ════════════════════════════════════════

function updateGPA() {
    const result = calcSemesterGPA(subjects);

    $('#gpaValue').textContent = result.gpa.toFixed(2);
    $('#totalCredits').textContent = `${result.totalCredits} หน่วยกิต`;
    $('#gpaStatus').textContent = result.totalCredits > 0 ? getGPAStatus(result.gpa) : '—';

    renderSummaryTable(result);
}

function renderSummaryTable(result) {
    const tbody = $('#summaryBody');
    const validSubjects = subjects.filter(s => parseFloat(s.credits) > 0);

    if (validSubjects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="no-data">ยังไม่มีข้อมูลรายวิชา</td></tr>';
        $('#summaryFooter').style.display = 'none';
        return;
    }

    tbody.innerHTML = validSubjects.map(s => {
        const credits = parseFloat(s.credits);
        const grade = parseFloat(s.grade);
        const qp = (credits * grade).toFixed(1);
        return `
      <tr>
        <td>${escapeHtml(s.name) || '<em style="color:var(--text-tertiary)">ไม่ระบุชื่อ</em>'}</td>
        <td>${credits}</td>
        <td class="grade-cell">${grade.toFixed(1)}</td>
        <td class="quality-cell">${qp}</td>
      </tr>
    `;
    }).join('');

    const footer = $('#summaryFooter');
    footer.style.display = 'flex';
    $('#footerCredits').textContent = `รวม ${result.totalCredits} หน่วยกิต`;
    $('#footerGPA').textContent = `GPA ${result.gpa.toFixed(2)}`;
}

// ════════════════════════════════════════
//  CUMULATIVE GPA
// ════════════════════════════════════════

function addSemester() {
    semesters.push({
        id: semesterIdCounter++,
        label: '',
        gpa: '',
        credits: '',
    });
}

function renderSemesters() {
    const list = $('#semesterList');
    list.innerHTML = semesters.map((s, i) => `
    <div class="semester-entry" data-id="${s.id}">
      <input type="text" class="sem-label" placeholder="เทอม ${i + 1}" value="${escapeHtml(s.label)}">
      <input type="number" class="sem-gpa" placeholder="GPA" min="0" max="4" step="0.01" value="${s.gpa}">
      <input type="number" class="sem-credits" placeholder="หน่วยกิต" min="0" max="100" step="1" value="${s.credits}">
      <button class="btn-remove" title="ลบเทอม">✕</button>
    </div>
  `).join('');
}

function syncSemesterData() {
    $$('.semester-entry').forEach(row => {
        const id = parseInt(row.dataset.id);
        const sem = semesters.find(s => s.id === id);
        if (!sem) return;
        sem.label = row.querySelector('.sem-label').value;
        sem.gpa = row.querySelector('.sem-gpa').value;
        sem.credits = row.querySelector('.sem-credits').value;
    });
}

function updateCumulativeGPA() {
    const result = calcCumulativeGPA(semesters);
    $('#cumulativeGPAValue').textContent = result.gpa.toFixed(2);
    $('#cumulativeTotalCredits').textContent = `${result.totalCredits} หน่วยกิต`;
    $('#cumulativeGPAStatus').textContent = result.totalCredits > 0 ? getGPAStatus(result.gpa) : '—';
}

function persistSemesters() {
    saveData(STORAGE_KEYS.SEMESTERS, semesters);
}

// ════════════════════════════════════════
//  TARGET GPA
// ════════════════════════════════════════

function updateTargetGPA() {
    const currentGPA = parseFloat($('#targetCurrentGPA').value) || 0;
    const currentCredits = parseFloat($('#targetCurrentCredits').value) || 0;
    const desiredGPA = parseFloat($('#targetDesiredGPA').value) || 0;
    const nextCredits = parseFloat($('#targetNextCredits').value) || 0;

    // Persist target form
    saveData(STORAGE_KEYS.TARGET, {
        currentGPA: $('#targetCurrentGPA').value,
        currentCredits: $('#targetCurrentCredits').value,
        desiredGPA: $('#targetDesiredGPA').value,
        nextCredits: $('#targetNextCredits').value,
    });

    if (currentCredits === 0 && nextCredits === 0) {
        $('#targetResultValue').textContent = '—';
        $('#targetResultNote').textContent = 'กรุณาใส่ข้อมูลให้ครบ';
        $('#targetResultValue').className = 'result-value';
        return;
    }

    const result = calcTargetGPA(currentGPA, currentCredits, desiredGPA, nextCredits);

    if (!result.isPossible) {
        $('#targetResultValue').textContent = result.requiredGPA.toFixed(2);
        $('#targetResultValue').className = 'result-value result-impossible';
        $('#targetResultNote').textContent = '❌ ไม่สามารถทำได้ (เกิน 4.00)';
    } else if (result.isEasy) {
        $('#targetResultValue').textContent = result.requiredGPA.toFixed(2);
        $('#targetResultValue').className = 'result-value result-easy';
        $('#targetResultNote').textContent = '💪 ทำได้สบาย!';
    } else {
        $('#targetResultValue').textContent = result.requiredGPA.toFixed(2);
        $('#targetResultValue').className = 'result-value';
        $('#targetResultNote').textContent = '📖 ต้องตั้งใจเรียน!';
    }
}

// ════════════════════════════════════════
//  RENDER ALL
// ════════════════════════════════════════

function renderAll() {
    renderSubjects();
    updateGPA();
    renderSemesters();
    updateCumulativeGPA();
    updateTargetGPA();
}

// ════════════════════════════════════════
//  UTILITIES
// ════════════════════════════════════════

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }
}

// ════════════════════════════════════════
//  DEVELOPER NOTICE
// ════════════════════════════════════════

function initDevNotice() {
    const notice = $('#devNotice');
    const closeBtn = $('#closeNotice');
    if (!notice || !closeBtn) return;

    // Hide if already dismissed
    const dismissed = loadData('tgpa_notice_dismissed', false);
    if (dismissed) {
        notice.classList.add('hidden');
        return;
    }

    closeBtn.addEventListener('click', () => {
        notice.classList.add('hidden');
        saveData('tgpa_notice_dismissed', true);
    });
}

// ════════════════════════════════════════
//  FORMULA TOGGLE
// ════════════════════════════════════════

function initFormulaToggle() {
    const btn = $('#toggleFormulaBtn');
    const section = $('#formulaSection');
    if (!btn || !section) return;

    btn.addEventListener('click', () => {
        const isHidden = section.classList.contains('hidden');
        if (isHidden) {
            section.classList.remove('hidden');
            btn.textContent = '📖 ปิดสูตรคำนวณ';
            // Scroll to section
            section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            section.classList.add('hidden');
            btn.textContent = '📖 ดูสูตรคำนวณ';
        }
    });
}
