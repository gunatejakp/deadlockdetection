document.getElementById('generateInput').addEventListener('click', generateInputFields);
document.getElementById('submitData').addEventListener('click', handleSubmit);

function generateInputFields() {
    const processCount = parseInt(document.getElementById('processCount').value);
    const resourceCount = parseInt(document.getElementById('resourceCount').value);

    if (isNaN(processCount) || isNaN(resourceCount)) {
        alert("Please enter valid numbers for processes and resources.");
        return;
    }

    const allocationFields = document.getElementById('allocationFields');
    const maxResourcesFields = document.getElementById('maxResourcesFields');
    const availableResourcesFields = document.getElementById('availableResourcesFields');

    allocationFields.innerHTML = '';
    maxResourcesFields.innerHTML = '';
    availableResourcesFields.innerHTML = '';

    for (let i = 0; i < processCount; i++) {
        const allocRow = document.createElement('div');
        const maxRow = document.createElement('div');
        allocRow.innerHTML = `<h4>Process ${i + 1} Allocation</h4>`;
        maxRow.innerHTML = `<h4>Process ${i + 1} Max Resources</h4>`;

        for (let j = 0; j < resourceCount; j++) {
            allocRow.innerHTML += `<label for="allocation${i}${j}">Resource ${j + 1}:</label><input type="number" id="allocation${i}${j}" placeholder="0" />`;
            maxRow.innerHTML += `<label for="maxResources${i}${j}">Resource ${j + 1}:</label><input type="number" id="maxResources${i}${j}" placeholder="0" />`;
        }

        allocationFields.appendChild(allocRow);
        maxResourcesFields.appendChild(maxRow);
    }

    const availableRow = document.createElement('div');
    availableRow.innerHTML = `<h4>Available Resources</h4>`;
    for (let i = 0; i < resourceCount; i++) {
        availableRow.innerHTML += `<label for="available${i}">Resource ${i + 1}:</label><input type="number" id="available${i}" placeholder="0" />`;
    }
    availableResourcesFields.appendChild(availableRow);

    document.getElementById('inputFieldsContainer').classList.remove('hidden');
}

function handleSubmit() {
    const processCount = parseInt(document.getElementById('processCount').value);
    const resourceCount = parseInt(document.getElementById('resourceCount').value);

    const allocation = [];
    const maxResources = [];
    const available = [];

    for (let i = 0; i < processCount; i++) {
        const allocRow = [];
        const maxRow = [];
        for (let j = 0; j < resourceCount; j++) {
            allocRow.push(parseInt(document.getElementById(`allocation${i}${j}`).value) || 0);
            maxRow.push(parseInt(document.getElementById(`maxResources${i}${j}`).value) || 0);
        }
        allocation.push(allocRow);
        maxResources.push(maxRow);
    }

    for (let i = 0; i < resourceCount; i++) {
        available.push(parseInt(document.getElementById(`available${i}`).value) || 0);
    }

    const result = deadlockDetection(processCount, resourceCount, allocation, maxResources, available);
    displayResult(result);
}

function deadlockDetection(processCount, resourceCount, allocation, maxResources, available) {
    const need = [];
    for (let i = 0; i < processCount; i++) {
        need[i] = [];
        for (let j = 0; j < resourceCount; j++) {
            need[i][j] = maxResources[i][j] - allocation[i][j];
        }
    }

    let work = [...available];
    let finish = new Array(processCount).fill(false);
    let result = [];
    let progressMade;

    do {
        progressMade = false;
        for (let i = 0; i < processCount; i++) {
            if (!finish[i] && canFinish(i, need, work)) {
                for (let j = 0; j < resourceCount; j++) {
                    work[j] += allocation[i][j];
                }
                finish[i] = true;
                result.push(`Process ${i} has finished.`);
                progressMade = true;
            }
        }
    } while (progressMade);

    for (let i = 0; i < processCount; i++) {
        if (!finish[i]) {
            result.push(`Deadlock detected: Process ${i} is in deadlock.`);
        }
    }

    return result;
}

function canFinish(process, need, work) {
    for (let j = 0; j < work.length; j++) {
        if (need[process][j] > work[j]) {
            return false;
        }
    }
    return true;
}

function displayResult(result) {
    const resultContainer = document.getElementById('resultContainer');
    const resultElement = document.getElementById('result');
    resultElement.textContent = result.join('\n');
    resultContainer.classList.remove('hidden');
}
