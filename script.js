Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};

const extendedGCD = (p, q) => {
    if (q === 0)
        return [p, 1, 0];
    const values = extendedGCD(q, p.mod(q));
    const d = values[0];
    const a = values[2];
    const b = values[1] - values[2] * Math.floor(p / q);
    return [d, a, b];
};

const isDivisible = (numerator, denominator) => numerator.mod(denominator) === 0;

const sortAscending = (a, b) => a - b;

const findModularSolutions = (input) => {
    const m = Math.abs(input[2]);
    const a = input[0].mod(m);
    const b = input[1].mod(m);
    const result_extended = extendedGCD(a, m);
    const solutions = [];
    if (!isDivisible(b, result_extended[0]))
        return solutions;
    const firstSolution = (result_extended[1] * (b / result_extended[0])).mod(m);
    for (let i = 0; i < result_extended[0]; i++) {
        const otherSolution = (firstSolution + i * (m / result_extended[0])).mod(m);
        solutions.push(otherSolution);
    }
    return solutions.sort(sortAscending);
};

const calculateClassOfResidues = (solutions, i, gcd) => {
    let results = [];
    for (let k = -2; k <= 1; k++) {
        const result = solutions[0] + (i[2] / gcd) * k;
        results.push(result);
    }
    return results;
}

const getInputValues = () => {
    const a = $("input[name=a]").val();
    const b = $("input[name=b]").val();
    const m = $("input[name=m]").val();
    return [Number(a), Number(b), Number(m)];
};

const calculateSolutions = () => {
    const input = getInputValues();
    const valid = validateInput(input);
    if (!valid)
        setOutput(valid);
    else
        setOutput(findModularSolutions(input));
};

const validateInput = (input) => {
    const [a, b, m] = input.map(Number);
    const isValid = Number.isInteger(a) && Number.isInteger(b) && Number.isInteger(m);
    return isValid;
};

const setOutput = (solutions) => {
    if (solutions === false) {
        $("textarea").val("a, b і m мають бути цілими числами!");
        return;
    }
    if (solutions.length === 0) {
        $("textarea").val("Розв'язку немає.");
    } else {

        const i = getInputValues();
        const gcd = extendedGCD(i[0], i[2])[0];
        const results = calculateClassOfResidues(solutions, i, gcd);

        $("textarea").val("x ≡ " + solutions + "(mod" + getInputValues()[2] + ").\n" + "Загальне рішення: " + solutions[0] + " + " + i[2] / gcd + "n.\n" + "Клас лишків: {..., " + results.join(', ') + ", ...}.");
    }
};

let firstClick = true;
$(document).ready(() => {
    $("button[type=button]").click(() => {
        calculateSolutions();
    });
    $("input[name=a], input[name=b], input[name=m]").keyup(() => {
        validateInput(getInputValues());
    });
});