function generateRandomNumber(limit) {
    return Math.random() * limit + 1;
}

function fixPath(collection) {
    let temp = collection.shift();
    collection.push(temp);
}

function updatePosition() {
    let temp1 = background.offsetTop;
    let temp2 = background.offsetLeft;

    gridStats.fixerVarLeft = temp2;
    gridStats.fixerVarTop = temp1;
}

function updateNeighParams() {
    neighborParams.left = [-gridStats.columns, -(gridStats.columns - 1), 1, (gridStats.columns + 1), gridStats.columns];
    neighborParams.middle = [-(gridStats.columns + 1), -gridStats.columns, -(gridStats.columns - 1), -1, 1, (gridStats.columns - 1), gridStats.columns, (gridStats.columns + 1)];
    neighborParams.right = [-(gridStats.columns + 1), -gridStats.columns, -1, gridStats.columns, (gridStats.columns - 1)];
    neighborParams.singleLeft = -1;
    neighborParams.singleRight = 1;
    neighborParams.singleTop = -gridStats.columns;
    neighborParams.singleBottom = gridStats.columns;
    neighborParams.singleCrossLeftBottom = (gridStats.columns - 1);
    neighborParams.singleCrossRightBottom = (gridStats.columns + 1);
    neighborParams.singleCrossRightTop = -(gridStats.columns - 1);
    neighborParams.singleCrossLeftTop = -(gridStats.columns + 1);

}

function removeElements(parent) {
    let nextLastChild = parent.lastElementChild
    while (nextLastChild) {
        parent.removeChild(nextLastChild)
        nextLastChild = parent.lastElementChild
    }
    // parent.childNodes.remove();
}

function updateGridInfo() {
    if (gridColumns.value === "") {
        gridColumns.value = gridStats.columns;
        gridBlocks.value = numOfBlockades;
        gridTotal.value = numOfGrid;
    } else {
        gridStats.columns = +gridColumns.value
        numOfBlockades = +gridBlocks.value;
        numOfGrid = +gridTotal.value;
    }

}

function setGrid() {
    gridStats.rows = Math.ceil(numOfGrid / gridStats.columns);
    background.style = ` grid-template-columns: repeat(${gridStats.columns}, 10px); grid-template-rows: repeat(${gridStats.rows}, 10px);`
    background.style.width = `${gridStats.columns*10}px`
    background.style.height = `${gridStats.rows*10}px`
}

function generateBackground(count) {
    for (let counter = 1; counter <= count; counter++)
        background.insertAdjacentHTML('beforeend', `<div class="landmark seed_${counter}" id="${counter}"></div>`)
}

function generateBlockades(count) {
    illuminatePath('override', blockades, 'rgb(0, 255, 0)');
    blockades = [];
    currentGridInfo.allCheckedNodes = []
    console.log('debug :', blockades);


    for (let counter = 1; counter <= count; counter++) {
        let seed = Math.round(generateRandomNumber(numOfGrid));
        blockades.push(seed);
    }
    quickSort(blockades, 0, blockades.length - 1);
    illuminatePath('override', blockades, 'rgb(0, 0, 0)');
}

function showFloatingMsg(string, time) {
    floatingMsg.textContent = string;
    floatingMsg.style = `padding:20px;width:max-content`

    setTimeout(() => {
        floatingMsg.textContent = ``;
        floatingMsg.style = null;
    }, time)
}

function updateViews(current) {
    sourceView.value = currentGridInfo.currentSource;
    currentView.value = current;
    targetView.value = currentGridInfo.currentTarget;
}

function endSequence(currentPositionId) {
    elementStat.moveComplete = true;
    playerCharacterPosition.lastPositionId = currentPositionId;
    document.getElementById(playerCharacterPosition.currentPositionId).style = ``;
}

function getPosition(elm2) {
    let elm = document.getElementById(elm2);
    let xpos = elm.offsetLeft - gridStats.fixerVarLeft;
    let ypos = elm.offsetTop - gridStats.fixerVarTop;
    return [xpos, ypos];
}

function resetPlayerChar() {
    playerCharacterPosition.placed = false;
    if (playerCharacterPosition.placed)
        document.getElementById(`1`).lastChild.remove();
    elementStat.moveComplete = true;
}

function illuminatePath(command, currentPath, color) {
    for (let iteration = 0; iteration < currentPath.length; iteration++) {
        if (currentPath[iteration] && +currentPath[iteration] > 0 && +currentPath[iteration] <= numOfGrid) {
            let element = document.getElementById(currentPath[iteration]);
            let elementColor = element.style.backgroundColor + '';

            if (command === "override") {
                element.style = `background-color:${color};`
            }


            if (elementColor !== 'rgb(255, 255, 255)' && elementColor !== color && elementColor != 'rgb(0, 0, 0)') {
                element.style = `background-color:${color};`

                if (color !== 'rgb(0, 0, 0)') {
                    currentGridInfo.allCheckedNodes.push(currentPath[iteration]);
                }

            }
        }
    }
}

function generalAnimation(position) {
    playerCharacter.style = `transform :translate(${position[0]}px,${position[1]}px)`;
    playerCharacterPosition.posX = position[0];
    playerCharacterPosition.posY = position[1];
}

function initiateGridInfo(elementId) {
    for (let i = 0; i < numOfGrid; i++) {
        currentGridInfo.gridToNodeRelations[i + 1] = [];
        currentGridInfo.gridToNodeWeights[i + 1] = [];
        currentGridInfo.gridToNodeLevel[i + 1] = [];
        currentGridInfo.tsSortstartTime[i + 1] = [];
        currentGridInfo.tsSortendTime[i + 1] = [];
        currentGridInfo.gridToNodeDistanceFromSource[i + 1] = Infinity;
        currentGridInfo.gridToNodeDistanceToTarget[i + 1] = -1;
        currentGridInfo.gridToNodeLevel[i] = -1;
    }
    currentGridInfo.pqForPathfinding.push(elementId, 0);
    currentGridInfo.gridToNodeDistanceFromSource[elementId] = 0;
    currentGridInfo.gridToNodeLevel[elementId] = 1;
    currentGridInfo.parentNode[elementId] = -1;
    currentGridInfo.allCheckedNodes.push(elementId);
    currentGridInfo.currentSource = elementId;
}

function resetGridInfo() {
    currentGridInfo.gridToNodeRelations = [];
    currentGridInfo.gridToNodeDistanceFromSource = [];
    currentGridInfo.gridToNodeDistanceToTarget = [];
    currentGridInfo.gridToNodeWeights = [];
    currentGridInfo.gridToNodeLevel = [];
    currentGridInfo.parentNode = [];
    currentGridInfo.pqForPathfinding.removeAll();
    currentPath = [];
    currentGridInfo.closedNode = [];
    currentGridInfo.currentSmallestfCost = Infinity;
    currentGridInfo.cycles = 0;
    currentGridInfo.timeVar = 0;
    tempi = 0;
    illuminatePath('override', currentGridInfo.allCheckedNodes, 'rgb(0, 255, 0)');
    currentGridInfo.allCheckedNodes = [];
    currentGridInfo.tsSortendTime = [];
    currentGridInfo.tsSortstartTime = [];
    currentGridInfo.traversalDone = false;
}

function printShortestPath(parents, node) {

    if (parents[node] === -1) {
        currentPath.push(node + "");
        return;
    }

    printShortestPath(parents, parents[node]);

    // console.log(node);


    currentPath.push(node + "");

}


function algorithmEndingAction(target, command) {
    if (command !== "nopath") {
        illuminatePath('override', [currentGridInfo.currentSource], 'yellow');
        // console.log(currentGridInfo.parentNode);


        printShortestPath(currentGridInfo.parentNode, target)

        placePlayerCharacterGrid(target);
        illuminatePath('override', currentPath, 'yellow');
        console.log(currentPath);
    } else {
        showFloatingMsg(`No path valid!`, 3000);
        updateViews('No path!')
        resetPlayerChar();
    }
}

function placePlayerCharacterGrid(target) {

    if (elementStat.animationType === 'Normal') {
        if (currentPath.length <= 0) {
            playerCharacterPosition.lastPositionId = target;
            elementStat.moveComplete = true;
            return;
        }

        let position = getPosition(currentPath.shift());
        generalAnimation(position);

        setTimeout(() => {
            placePlayerCharacterGrid(target);

        }, 200)
    } else {
        let position = getPosition(currentPath.pop());
        playerCharacterPosition.lastPositionId = target;
        elementStat.moveComplete = true;
        generalAnimation(position);
    }
}

function calculateDistance(source, target) {
    let sourcePos = getPosition(source);
    let targetPos = getPosition(target);

    let distance = Math.pow((sourcePos[0] - targetPos[0]), 2) + Math.pow((sourcePos[1] - targetPos[1]), 2);

    return distance;
}