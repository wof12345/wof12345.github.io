const executionButton = document.querySelector(`.start_execution`);
const resultClearButton = document.querySelector(`.clear`);
const mainText = document.querySelector(`.main_text`);
const generatorCont = document.querySelector(`.input_gen_cont`);
let selectionValue = document.getElementById(`choice`).value;
// console.log(mainText);


pageElements.choice.addEventListener('change', () => {
    setInfo(getInfo(pageElements.choice.value));
    selectionValue = document.getElementById(`choice`).value;
    usefulVariables.currentAlgorithm = selectionValue;

    if (selectionValue === 'BFS' || selectionValue === 'DFS' || selectionValue === 'Dijkstra') {
        // console.log(selectionValue);
        pageElements.generation_guide.innerHTML = `Graph to generate : <br>(number of Nodes and Edges <br> seperated by comma.<br>If weighted, third input should <br> be 1 else 0.<br>  e.g: (Nodes, Edges, hasweight)<br>  (10, 12, 0))`
        mainText.textContent = 'Input should be seperated by space and comma. E.g. (2 3,4 5,6 7). Note that first line only represents the number of nodes and edges. If there is no weight then the third input followed by space should be 0, Eliminating input should be a single  node denoting the source. If there is a target it should be followed by the source.'
    } else {
        pageElements.generation_guide.innerHTML = `Number of inputs to generate : <br>(number of inputs and input <br> range seperated by comma.<br>  e.g: (number of elements,range)<br>  (200,600))`;
        generatorCont.style.display = '';
        mainText.textContent = 'Input for the algorithm (If array, elements should be seperated by ",". Note that iterations are not balanced :)';
    }
})

executionButton.addEventListener('click', () => {
    clear();
    mainText.textContent = 'Input for the algorithm (If array, elements should be seperated by ",". Note that iterations are not balanced :)';

    const selectionValue = document.getElementById(`choice`).value;
    let input = document.getElementById(`input`).value;
    let givenArray = input.split(',');
    // console.log(givenArray);


    if (selectionValue !== 'BFS' && selectionValue !== 'DFS' && selectionValue !== 'Dijkstra') {
        givenarray = numberify(givenArray);
    }
    if (selectionValue === 'Selection-sort') {
        selectionSort(givenArray);
    }
    if (selectionValue === 'Insertion-sort') {
        insertionsort(givenArray);
    }
    if (selectionValue === 'Merge-sort') {
        let originalInput = [];
        originalInput += givenArray;
        timer('start');
        mergesort(givenArray, 0, givenArray.length - 1, originalInput);
        const timeTaken = timer('stop');
        iterationPush(`Iterated : ${backupVariables.globalteration-1} times.`, `Time taken : ${timeTaken} seconds`, ``, `Current collection : ${givenArray}`, `Original collection : ${originalInput}`)
        invoke_floater('left:10px;top:20px', `Iterated : ${backupVariables.globalteration-1} times. Time taken : ${timeTaken} seconds`, 2000);
        backupVariables.lastTime = timeTaken;
    }
    if (selectionValue === 'Quick-sort') {
        let originalInput = [];
        originalInput += givenArray;
        timer('start');
        quickSort(givenArray, 0, givenArray.length - 1, originalInput);
        const timeTaken = timer('stop');
        iterationPush(`Iterated : ${backupVariables.globalteration-1} times.`, `Time taken : ${timeTaken} seconds`, ``, `Current collection : ${givenArray}`, `Original collection : ${originalInput}`)
        invoke_floater('left:10px;top:20px', `Iterated : ${backupVariables.globalteration-1} times. Time taken : ${timeTaken} seconds`, 2000);
        backupVariables.lastTime = timeTaken;
    }
    if (selectionValue === 'Heap-sort') {
        heapSort(givenArray, givenArray.length);
    }
    if (selectionValue === 'Bubble-sort') {
        bubblesort(givenArray);
    }
    if (selectionValue === 'BFS') {
        // console.log(givenArray);
        processGraph(givenArray, selectionValue);

        timer('start');
        BFS();
        backupVariables.lastTime = timer('stop');
        currentGraphInfo.visitState.sort((a, b) => a - b);
        // console.log('Nodes and edges : ', currentGraphInfoEN);
    }
    if (selectionValue === 'DFS') {
        console.log(selectionValue);
        processGraph(givenArray, selectionValue);

        timer('start');
        DFS(currentGraphInfo.source, -1);
        backupVariables.lastTime = timer('stop');
        // currentGraphInfo.iterationSerial.shift();
        console.log(currentGraphInfo.tsSortstartTime);
        console.log(currentGraphInfo.tsSortendTime);
        // console.log('Nodes and edges : ', currentGraphInfoEN);
        invoke_floater('left:10px;top:20px', `Iterated : ${backupVariables.globalteration-1} times. There are ${currentGraphInfo.cycles} cycles in this graph.`, 2000);
    }
    if (selectionValue === 'Dijkstra') {
        processGraph(givenArray, selectionValue);
        timer('start');
        Dijkstra(currentGraphInfo.target);
        backupVariables.lastTime = timer('stop');
    }
    console.log(currentGraphInfo.iterationSerial);
    console.log(currentGraphInfo.visitState);

    resetGraphInfo();
    updateGraph(selectionValue, givenArray.length, backupVariables.lastTime);
    // console.log(lastIterationQueries.iterations.length, lastIterationQueries.iterations);
    // console.log(givenArray);



})

resultClearButton.addEventListener('click', () => {
    clear();
})

pageElements.floater.addEventListener('click', () => {
    deflate_floater();
})

pageElements.display_toggle.addEventListener('click', () => {
    if (!backupVariables.iterationShown) {
        iteration_toggle('show')
    } else {
        iteration_toggle('hide')
    }
})

pageElements.generationButton.addEventListener('click', () => {
    resetGenerationInfo();
    let number = pageElements.input_box.value;
    number = number.split(',');

    numberify(number)

    let tempString = '';
    // console.log(number);

    if (usefulVariables.currentAlgorithm === 'BFS' || usefulVariables.currentAlgorithm === 'DFS' || usefulVariables.currentAlgorithm === 'Dijkstra') {
        tempString = generateGraph(number);
    } else
        tempString = generateInputArray(number);

    document.getElementById(`input`).value = tempString;
})

pageElements.floater_indicator.addEventListener('click', () => {
    if (!pageLogics.floater_gen_shrunk) {
        pageElements.floater_indicator.style = ` transform: rotate(180deg);`
        pageLogics.floater_gen_shrunk = true;
        pageElements.input_gen_cont.style = `transform: translateX(262px);`
    } else {
        pageElements.floater_indicator.style = ``
        pageLogics.floater_gen_shrunk = false;
        pageElements.input_gen_cont.style = ``
    }
})

pageElements.input.addEventListener('focus', () => {
    pageElements.input.style = `width:100%;`;
})

pageElements.input.addEventListener('blur', () => {
    pageElements.input.style = ``;
})

// currentGraphInfo.priorityQueue.push('23', 1);
// currentGraphInfo.priorityQueue.push('25', 1);
// currentGraphInfo.priorityQueue.push('24', 2);
// currentGraphInfo.priorityQueue.front();
// console.log(currentGraphInfo.priorityQueue.printPQueue());

// currentGraphInfo.priorityQueue.removeAll();

// console.log(currentGraphInfo.priorityQueue.printPQueue());

// let array = [2, 4, 45, 5, 12, 3, 10, 1]
// array.sort((a, b) => a - b)
// console.log(binarySearch(array, 0, array.length - 1, 11), array);