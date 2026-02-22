/* ============================================
   Calculator Module — GPA Computation Engine
   ============================================ */

/**
 * Calculate semester GPA from a list of subjects.
 * @param {Array<{name: string, credits: number, grade: number}>} subjects
 * @returns {{ gpa: number, totalCredits: number, totalQualityPoints: number }}
 */
function calcSemesterGPA(subjects) {
    let totalCredits = 0;
    let totalQualityPoints = 0;

    for (const s of subjects) {
        const credits = parseFloat(s.credits) || 0;
        const grade = parseFloat(s.grade) || 0;
        if (credits > 0) {
            totalCredits += credits;
            totalQualityPoints += grade * credits;
        }
    }

    const gpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

    return {
        gpa: Math.round(gpa * 100) / 100,
        totalCredits,
        totalQualityPoints: Math.round(totalQualityPoints * 100) / 100,
    };
}

/**
 * Calculate cumulative GPA from multiple semesters.
 * @param {Array<{label: string, gpa: number, credits: number}>} semesters
 * @returns {{ gpa: number, totalCredits: number }}
 */
function calcCumulativeGPA(semesters) {
    let totalCredits = 0;
    let totalQualityPoints = 0;

    for (const sem of semesters) {
        const credits = parseFloat(sem.credits) || 0;
        const gpa = parseFloat(sem.gpa) || 0;
        if (credits > 0) {
            totalCredits += credits;
            totalQualityPoints += gpa * credits;
        }
    }

    const cumulativeGPA = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

    return {
        gpa: Math.round(cumulativeGPA * 100) / 100,
        totalCredits,
    };
}

/**
 * Calculate required GPA for the next semester to achieve a target.
 * @param {number} currentGPA
 * @param {number} currentCredits
 * @param {number} targetGPA
 * @param {number} nextCredits
 * @returns {{ requiredGPA: number, isPossible: boolean, isEasy: boolean }}
 */
function calcTargetGPA(currentGPA, currentCredits, targetGPA, nextCredits) {
    const currentQP = currentGPA * currentCredits;
    const totalNeededQP = targetGPA * (currentCredits + nextCredits);
    const neededQP = totalNeededQP - currentQP;
    const requiredGPA = nextCredits > 0 ? neededQP / nextCredits : 0;

    return {
        requiredGPA: Math.round(requiredGPA * 100) / 100,
        isPossible: requiredGPA <= 4.0 && requiredGPA >= 0,
        isEasy: requiredGPA <= 2.5,
    };
}

/**
 * Get GPA status text in Thai
 * @param {number} gpa
 * @returns {string}
 */
function getGPAStatus(gpa) {
    if (gpa >= 3.5) return '🌟 ดีเยี่ยม';
    if (gpa >= 3.0) return '✨ ดีมาก';
    if (gpa >= 2.5) return '👍 ดี';
    if (gpa >= 2.0) return '📚 พอใช้';
    if (gpa >= 1.0) return '⚠️ ต้องปรับปรุง';
    return '❗ ต่ำมาก';
}

export { calcSemesterGPA, calcCumulativeGPA, calcTargetGPA, getGPAStatus };
