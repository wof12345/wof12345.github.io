function generateRandomNumber(arrayToCompare, lowerrange, upperrange, numberNottoUse) {
    if (lowerrange > upperrange) {
        lowerrange = upperrange;
    }
    let generatedNumber = +((((Math.random() * (upperrange - lowerrange + 1)) + lowerrange) - 1).toFixed(0));
    console.log(!binarySearch(arrayToCompare, 0, arrayToCompare.length - 1, generatedNumber), generatedNumber, arrayToCompare, lowerrange, upperrange);

    if (graphGenerationTracker.infiniteStackTracker > 500) {
        graphGenerationTracker.infiniteStackTracker = 0;
        return 0;
    }
    graphGenerationTracker.infiniteStackTracker++;
    if (!binarySearch(arrayToCompare, 0, arrayToCompare.length - 1, generatedNumber) && generatedNumber !== numberNottoUse && generatedNumber > 0) {
        graphGenerationTracker.infiniteStackTracker = 0;
        return generatedNumber;
    } else {
        return generateRandomNumber(arrayToCompare, lowerrange, upperrange, numberNottoUse);
    }
}

function printSet(set) {
    let srt = '';
    set.forEach(function(value) {
        srt += value + " ";
    })
    return srt;
}

function stringyfyPQ(PQ) {
    let tempArr = [];
    PQ.split(" ").forEach(elm => {
        if (elm !== "" && elm !== " ")
            tempArr.push(+elm);
    })
    return tempArr;
}

function clear() {
    deflate_floater();
    backupVariables.globalteration = 1;
    lastIterationQueries.iterations = [];
    clearDisplay();
    iteration_toggle('hide')
}

function clearDisplay() {
    let children = pageElements.resultDisplay;
    while (children.childElementCount) {
        children.removeChild(children.firstElementChild)
    }
}

function numberify(array) {
    for (let i = 0; i < array.length; i++) {
        array[i] = +array[i];
    }
    return array;
}

function timer(command) {
    if (command === `start`) {
        let dateob = performance.now();
        lastTimerValue = dateob;
        console.log('(Start)');
        // console.log(dateob, lastTimerValue);
    }

    if (command === `stop`) {
        let dateob = performance.now();
        console.log('Time taken to execute :(Stop) ', dateob - lastTimerValue);
        return Math.abs(dateob - lastTimerValue) / 1000;
    }
}

function setInfo(info) {
    pageElements.infoBox.innerHTML = info;
}

function iterationPush(iterationNumber, information1, changes, currentInputState, originalInput) {
    lastIterationQueries.iterations.push(iteraionBlock.block(iterationNumber, information1, changes, currentInputState, originalInput))
}

function iterationView(collection) {
    // console.log('works', collection.length);
    if (collection.length <= 0) pageElements.resultDisplay.insertAdjacentHTML('beforeend', `<p>Nothing</p>`);
    else {
        clearDisplay();
        for (let it = 0; it < collection.length; it++) {
            pageElements.resultDisplay.insertAdjacentHTML('beforeend', collection[it]);
        }
    }
}

function deflate_floater() {
    pageElements.floater.style = `left:-400px;top:0;`;
}

function invoke_floater(style, text, duration) {
    pageElements.floater.style = style;
    pageElements.floater_text.textContent = text;

    if (duration < 2000) {
        setTimeout(() => {
            deflate_floater();
        }, duration);
    }
}

function iteration_toggle(command) {
    if (command === "show") {
        backupVariables.iterationShown = !backupVariables.iterationShown;
        iterationView(lastIterationQueries.iterations);
        pageElements.display_toggle.style = '  background-color: rgba(174, 203, 228, 0.514);';
    } else {
        backupVariables.iterationShown = !backupVariables.iterationShown;
        clearDisplay();
        pageElements.display_toggle.style = '';
    }
}

function updateChartNecessity(title) {
    myChart.options.plugins.title.text = '' + title;
    myChart.update();
}

function assignTemp(givenData, givenLabels) {
    givenData.forEach((elm, ind) => {
        chartCurrentData.data.push(elm);
        chartCurrentData.labels.push(givenLabels[ind])
    })
}

function emptyCurrentStorageSafe() {
    for (let it = 0; it < chartCurrentData.data.length + 1; it++) {
        // console.log(!isNaN(chartCurrentData.data[it]), chartCurrentData.data[it]);
        if (!isNaN(chartCurrentData.data[it])) {
            chartCurrentData.data.splice(it, 1);
            chartCurrentData.labels.splice(it, 1);
            it--;
        }
    }
}


function updateGraph(algorithm, label, time) {
    if (algorithm === 'Selection-sort') {
        // console.log(algorithm, label, time);

        chartData.algo1.push(time);
        chartData.algo1labels.push(label);

        assignTemp(chartData.algo1, chartData.algo1labels);
        // console.log(chartCurrentData.labels, chartCurrentData.data);

        updateChartNecessity(algorithm);
    } else if (algorithm === 'Merge-sort') {
        // console.log(algorithm, label, time);

        chartData.algo2.push(time);
        chartData.algo2labels.push(label);

        assignTemp(chartData.algo2, chartData.algo2labels);
        // console.log(chartCurrentData.labels, chartCurrentData.data);

        updateChartNecessity(algorithm);
    } else if (algorithm === 'Bubble-sort') {
        // console.log(algorithm, label, time);

        chartData.algo3.push(time);
        chartData.algo3labels.push(label);

        assignTemp(chartData.algo3, chartData.algo3labels);
        // console.log(chartCurrentData.labels, chartCurrentData.data);

        updateChartNecessity(algorithm);
    } else if (algorithm === 'Quick-sort') {
        // console.log(algorithm, label, time);

        chartData.algo4.push(time);
        chartData.algo4labels.push(label);

        assignTemp(chartData.algo4, chartData.algo4labels);
        // console.log(chartCurrentData.labels, chartCurrentData.data);

        updateChartNecessity(algorithm);
    } else if (algorithm === 'Heap-sort') {
        // console.log(algorithm, label, time);

        chartData.algo5.push(time);
        chartData.algo5labels.push(label);

        assignTemp(chartData.algo5, chartData.algo5labels);
        // console.log(chartCurrentData.labels, chartCurrentData.data);

        updateChartNecessity(algorithm);
    } else if (algorithm === 'Insertion-sort') {
        // console.log(algorithm, label, time);

        chartData.algo6.push(time);
        chartData.algo6labels.push(label);

        assignTemp(chartData.algo6, chartData.algo6labels);
        // console.log(chartCurrentData.labels, chartCurrentData.data);

        updateChartNecessity(algorithm);
    } else if (algorithm === 'Insertion-sort') {
        // console.log(algorithm, label, time);

        chartData.algo6.push(time);
        chartData.algo6labels.push(label);

        assignTemp(chartData.algo6, chartData.algo6labels);
        // console.log(chartCurrentData.labels, chartCurrentData.data);

        updateChartNecessity(algorithm);

        // console.log(chartCurrentData.labels, chartCurrentData.data);
    } else if (algorithm === 'BFS') {
        // console.log(algorithm, label, time);

        chartData.algo7.push(time);
        chartData.algo7labels.push(label);

        assignTemp(chartData.algo7, chartData.algo7labels);
        // console.log(chartCurrentData.labels, chartCurrentData.data);

        updateChartNecessity(algorithm);
    } else if (algorithm === 'DFS') {
        // console.log(algorithm, label, time);

        chartData.algo8.push(time);
        chartData.algo8labels.push(label);

        assignTemp(chartData.algo8, chartData.algo8labels);
        // console.log(chartCurrentData.labels, chartCurrentData.data);

        updateChartNecessity(algorithm);
    } else if (algorithm === 'Dijkstra') {
        // console.log(algorithm, label, time);

        chartData.algo9.push(time);
        chartData.algo9labels.push(label);

        assignTemp(chartData.algo9, chartData.algo9labels);
        // console.log(chartCurrentData.labels, chartCurrentData.data);

        updateChartNecessity(algorithm);
    }
    emptyCurrentStorageSafe();
}

function resetGraphInfo() {
    currentGraphInfo.graphName = null
    currentGraphInfo.nodes = 0;
    currentGraphInfo.edges = 0;
    currentGraphInfo.source = 0;
    currentGraphInfo.target = 0;
    currentGraphInfo.visitState = [];
    currentGraphInfo.currentArrayState = [];
    currentGraphInfo.graphRelations = [];
    currentGraphInfo.cycles = 0;
    givenArray = [];
    currentGraphInfo.tsSortstartTime = [];
    currentGraphInfo.tsSortendTime = [];
    currentGraphInfo.iterationSerial = [];
    currentGraphInfo.weights = [];
    currentGraphInfo.timeVar = 1;
    currentGraphInfo.priorityQueue.removeAll();
}

function resetGenerationInfo() {
    graphGenerationTracker.nodesUsedSoFar.removeAll();
    graphGenerationTracker.nodesArray = [];
    graphGenerationTracker.edgesUsedSofar = []
}

function initiateGraphGen(nodes) {
    // console.log(nodes);
    for (let i = 0; i < nodes; i++) {
        graphGenerationTracker.edgesUsedSofar[i + 1] = [];
    }

}

function processGraph(relations, algorithm) {

    let currentGraphInfoTemp = relations.shift();
    let currentGraphInfoEN = currentGraphInfoTemp.split(' ');
    currentGraphInfo.nodes = currentGraphInfoEN[0];
    currentGraphInfo.edges = currentGraphInfoEN[1];
    let userConstants = relations.pop();
    if (userConstants.length > 1) {
        userConstants = userConstants.split(' ');
        currentGraphInfo.target = userConstants[1];
        currentGraphInfo.source = userConstants[0];
    } else
        currentGraphInfo.source = userConstants;

    // console.log(userConstants);

    currentGraphInfo.priorityQueue.push(currentGraphInfo.source, 0);
    currentGraphInfo.currentArrayState.push(currentGraphInfo.source);
    currentGraphInfo.iterationSerial.push(currentGraphInfo.source);


    for (let i = 0; i < currentGraphInfoEN[0]; i++) {
        currentGraphInfo.graphRelations[i + 1] = new Set();
        currentGraphInfo.weights[i + 1] = [];
        if (algorithm === 'Dijkstra') {
            currentGraphInfo.visitState[i + 1] = Infinity;
        } else
            currentGraphInfo.visitState[i + 1] = -1;
    }
    currentGraphInfo.visitState[currentGraphInfo.source] = 0;

    for (let i = 0; i < currentGraphInfoEN[1]; i++) {
        let localArr = relations[i].split(' ');
        // console.log("iteration : ", i, localArr[1], );

        currentGraphInfo.graphRelations[localArr[0]].add(localArr[1]);
        currentGraphInfo.weights[localArr[0]].push(localArr[2]);
        currentGraphInfo.graphRelations[localArr[1]].add(localArr[0]);
        currentGraphInfo.weights[localArr[1]].push(localArr[2]);

    }
    console.log("Graph rels : ", currentGraphInfo.graphRelations);
    console.log('Graph weights', currentGraphInfo.weights);
    // console.log('Graph source and it\'s level', currentGraphInfo.source, currentGraphInfo.visitState);
}

function generateInputArray(number) {
    let tempString = '';
    for (let it = 0; it < number[0]; it++) {
        tempString += generateRandomNumber([], 1, number[1], 0);
        if (it + 1 != number[0]) {
            tempString += ",";
        }
    }
    return tempString;
}

function generateGraph(number) {
    let tempString = '';

    let edgeCount = 0;
    let maxEdgeCount = +number[1];
    let currentNodeMaxEdge = 0;

    let maxNodeCount = +number[0];
    initiateGraphGen(maxNodeCount)
    console.log(graphGenerationTracker.edgesUsedSofar);


    let maximumPredefinedEdgeCount = Math.round((maxNodeCount * (maxNodeCount - 1)) / 2);
    if (maxEdgeCount > maximumPredefinedEdgeCount) {
        invoke_floater('left:10px;top:20px', `Maximum edge is ${maximumPredefinedEdgeCount}.`, 2000);
        maxEdgeCount = number[1] = maximumPredefinedEdgeCount;
        pageElements.input_box.value = number[0] + "," + number[1] + "," + number[2];
    }

    tempString = '' + number[0] + " " + number[1] + ",";
    for (let i = 1; i <= maxNodeCount; i++) {
        let nextMaxEdgeValue = maxEdgeCount - edgeCount;
        if (i === 1) {
            nextMaxEdgeValue = Math.round(nextMaxEdgeValue / 2);
        }
        currentNodeMaxEdge = +generateRandomNumber([], 1, (nextMaxEdgeValue), 0);
        if (edgeCount + currentNodeMaxEdge > maxEdgeCount) {
            currentNodeMaxEdge = (edgeCount + currentNodeMaxEdge) - maxEdgeCount;
        }

        if (i + 1 === maxNodeCount) {
            currentNodeMaxEdge = nextMaxEdgeValue;
        }

        if (currentNodeMaxEdge > maxNodeCount - 1) {
            currentNodeMaxEdge = maxNodeCount - i;
        }

        graphGenerationTracker.nodesArray = [];
        graphGenerationTracker.nodesUsedSoFar.removeAll();

        for (let n = 0; n < graphGenerationTracker.edgesUsedSofar[i].length; n++) {
            let node = graphGenerationTracker.edgesUsedSofar[i][n];
            graphGenerationTracker.nodesUsedSoFar.push(node, node);
            graphGenerationTracker.nodesArray = stringyfyPQ(graphGenerationTracker.nodesUsedSoFar.printPQueue());
            currentNodeMaxEdge--;
            console.log('Gen Node : ', node, currentNodeMaxEdge);
        }
        if (currentNodeMaxEdge <= 0) currentNodeMaxEdge = 1;

        edgeCount += +currentNodeMaxEdge;
        console.log("currentEdgeCount : ", edgeCount);

        for (let j = 0; j < currentNodeMaxEdge; j++) {
            console.log(`Node 1:${i}, Node 2:${j},Used Nodes ${graphGenerationTracker.nodesArray}`);
            let nodeToUse = +generateRandomNumber(graphGenerationTracker.nodesArray, 1, maxNodeCount, i);
            graphGenerationTracker.nodesArray = [];
            graphGenerationTracker.nodesUsedSoFar.push(nodeToUse, nodeToUse);
            graphGenerationTracker.nodesArray = stringyfyPQ(graphGenerationTracker.nodesUsedSoFar.printPQueue());
            tempString += i + " " + nodeToUse + " ";
            if (+number[2] === 1) {
                tempString += generateRandomNumber([], 1, maxEdgeCount, 0);
            } else {
                tempString += 0;
            }
            tempString += ',';
        }
        console.log(graphGenerationTracker.nodesArray);

        for (let n = 0; n < graphGenerationTracker.nodesArray.length; n++) {
            graphGenerationTracker.edgesUsedSofar[graphGenerationTracker.nodesArray[n]].push(i);
        }
        console.log(`Tracker : `, graphGenerationTracker.edgesUsedSofar);

        if (edgeCount >= maxEdgeCount) {
            break;
        }

    }
    tempString += generateRandomNumber([], 2, maxNodeCount) + " " + generateRandomNumber([], 1, maxNodeCount, 0);
    console.log(tempString);

    return tempString;
}