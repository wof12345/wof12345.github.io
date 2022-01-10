generateBackground(numOfGrid); //24384
updateGridInfo();
setGrid();
generateBlockades(numOfBlockades);

function driverFunction(currentNode) {
    if (!binarySearch(currentGridInfo.closedNode, 0, currentGridInfo.closedNode.length, currentNode)) {
        let currentNeighbors = [];
        currentNode = +currentNode;
        let arrayToFollow = neighborParams.middle;

        if (currentNode % gridStats.columns === 0) {
            arrayToFollow = neighborParams.right;
        }
        if ((currentNode - 1) % gridStats.columns === 0) {
            arrayToFollow = neighborParams.left;
        }

        for (let i = 0; i < arrayToFollow.length; i++) {
            let neighTemNode = currentNode + +arrayToFollow[i];
            let distance;

            if (neighTemNode <= numOfGrid && neighTemNode > 0) {
                currentNeighbors.push(neighTemNode)
                    // console.log(neighTemNode);

                currentGridInfo.gridToNodeRelations[currentNode].push(neighTemNode);
                currentGridInfo.gridToNodeRelations[neighTemNode].push(currentNode);

                distance = calculateDistance(neighTemNode, currentNode);
                currentGridInfo.gridToNodeWeights[currentNode].push(distance);
                currentGridInfo.gridToNodeWeights[neighTemNode].push(distance);
            }
        }

        illuminatePath('', currentNeighbors, 'rgba(255, 0, 0, 0.99)')
        tempi++;
    }
}

function determineJourneyStats(elementId) {
    initiateGridInfo(playerCharacterPosition.lastPositionId);
    if (elementStat.currentAlgorithm === 'Dijkstra')
        Dijkstra(elementId);
    else if (elementStat.currentAlgorithm === 'A*')
        Astar(elementId);
    else if (elementStat.currentAlgorithm === 'DFS') {
        DFS(currentGridInfo.currentSource, 0, elementId)
    } else if (elementStat.currentAlgorithm === 'BFS') {
        BFS(elementId)
    }
}

function placePlayerCharacter(element, elementId, position) {
    currentGridInfo.currentTarget = elementId;
    if (element.lastChild ?.className !== 'playerCharacter' && !playerCharacterPosition.placed) {
        element.insertAdjacentHTML('beforeend', '<div class="playerCharacter"></div>')
        playerCharacterPosition.placed = true;
        playerCharacter = document.querySelector(`.playerCharacter`)
        playerCharacterPosition.posX = position[0];
        playerCharacterPosition.posY = position[1];
        playerCharacterPosition.currentPositionId = elementId;
        playerCharacterPosition.lastPositionId = elementId;

        generalAnimation(position);
        endSequence(playerCharacterPosition.currentPositionId);
    } else {
        illuminatePath('', [elementId], 'rgba(255, 0, 0, 0.5)')
        determineJourneyStats(elementId);
    }

}

background.addEventListener('click', function(e) {
    let goingto = +e.target.id;
    let pos = getPosition(goingto);
    if (!pageLogics.add_block_mode_on) {
        let topPos = pos[1];
        let leftPos = pos[0];
        updatePosition();
        if (goingto.className === 'playerCharacter') {}
        if (elementStat.moveComplete && !binarySearch(blockades, 0, blockades.length - 1, goingto) && !(goingto.className === 'playerCharacter')) {
            elementStat.moveComplete = false;
            playerCharacterPosition.currentPositionId = goingto;
            playerClickCounter++;
            resetGridInfo();

            if (e.target.className !== 'playerCharacter') {
                if (!playerCharacterPosition.placed)
                    goingto = document.querySelector(`.seed_1`);

                placePlayerCharacter(goingto, playerCharacterPosition.currentPositionId, [leftPos, topPos]);
            }
        }
    } else {
        if (!binarySearch(blockades, 0, blockades.length - 1, goingto) && goingto && pageLogics.add_block_mode_on) {
            // console.log(blockades);
            let tempArr = [goingto];
            if (pageKeyPressRecords.currentKeyPressed === 'Shift') {
                let isValid = processAndReturn(goingto);
                if (isValid)
                    tempArr = isValid;
            }
            add_blockade(tempArr);
            // console.log(blockades);
        }
    }
})

algo_select.addEventListener('change', function(e) {
    let algorithm = algo_select.value;
    algorithmView.textContent = `Movement algorithm is ${algorithm}.`;
    elementStat.currentAlgorithm = algorithm;

    showFloatingMsg(`Algorithm changed to ${elementStat.currentAlgorithm}`, 1000);
})


animation_select.addEventListener('change', () => {
    let animation_value = animation_select.value;

    elementStat.animationType = animation_value;

})

gridGenerationBtn.addEventListener('click', () => {
    // console.log('clicked');
    resetPlayerChar();
    removeElements(background);
    updateGridInfo();
    generateBackground(numOfGrid);
    setGrid();
    updateNeighParams();
    generateBlockades(numOfBlockades);
    // console.log(blockades);
    resetGridInfo();
    // console.log(gridStats);
    // console.log(neighborParams);
})

gridOptionbtn.addEventListener('click', () => {
    controlGridOptionDrop(pageLogics.grid_optionOpen);
    updatePosition();
})

traversalOptionbtn.addEventListener('click', () => {
    controlTraversalOptionDrop(pageLogics.traversal_optionOpen);
    updatePosition();
})

gridresetBtn.addEventListener('click', () => {
    resetPlayerChar();
    resetGridInfo();
})

add_block.addEventListener('click', () => {
    if (!pageLogics.add_block_mode_on) {
        pageLogics.add_block_mode_on = true;
        block_add_mode_toggle(false);
    } else {
        pageLogics.add_block_mode_on = false;
        block_add_mode_toggle(true);
    }
})

window.addEventListener('resize', () => {
    updatePosition();
})

document.addEventListener('click', function(e) {
    // console.log(e.target.parentNode.className);

    if (e.target.parentNode.className !== 'background' && pageLogics.add_block_mode_on && e.target.className !== 'grid_add_block') {
        block_add_mode_toggle(true);
    }

})

document.addEventListener('keydown', (e) => {
    pageKeyPressRecords.currentKeyPressed = e.key;

})

document.addEventListener('keyup', (e) => {
    if (e.key === pageKeyPressRecords.currentKeyPressed) {
        pageKeyPressRecords.currentKeyPressed = null;
    }

})