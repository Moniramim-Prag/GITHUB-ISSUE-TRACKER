const issuesContainer = document.getElementById("issuesContainer")
const issueCount = document.getElementById("issueCount")
const loadingSpinner = document.getElementById("loadingSpinner")

const allBtn = document.getElementById("allBtn")
const openBtn = document.getElementById("openBtn")
const closedBtn = document.getElementById("closedBtn")

const searchInput = document.getElementById("searchInput")

let allIssues = []

if(!localStorage.getItem("isLoggedIn")){
window.location.href = "main.html"
}

function showLoading() {
    loadingSpinner.classList.remove("hidden")
    issuesContainer.innerHTML = ""
}

function hideLoading() {
    loadingSpinner.classList.add("hidden")
}



// LOAD ISSUES
async function loadIssues() {

    showLoading()

    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    const data = await res.json()

    allIssues = data.data

    displayIssues(allIssues)

    hideLoading()

}



// DISPLAY ISSUES
function displayIssues(issues) {

    issuesContainer.innerHTML = ""

    issueCount.innerText = `${issues.length} Issues`

    issues.forEach(issue => {
        const priority = issue.priority.toUpperCase()

        const card = document.createElement("div")

        card.className = `card bg-white shadow border-t-4 ${(priority === "HIGH" || priority === "MEDIUM")
                ? "border-green-500"
                : "border-purple-500"
            }`

        card.innerHTML = `

<div class="card-body">

<!-- TOP ROW -->
<div class="flex justify-between items-center">

<div class="flex items-center gap-2">

${
priority === "LOW"
? `<i class="fa-solid fa-circle-check text-green-500 text-lg"></i>`
: `<i class="fa-solid fa-sun" style="color: rgb(177, 151, 252);"></i>`
}

 

</div>

<span class="badge ${
priority === "HIGH"
? "badge-error"
: priority === "MEDIUM"
? "badge-warning"
: "badge-success"
}">
${priority}
</span>

</div>


<!-- TITLE -->
<div onclick="openIssue(${issue.id})" class="cursor-pointer">

<h2 class="text-2xl font-bold hover:text-blue-500 mt-2">
${issue.title}
</h2>

<p class="text-sm text-gray-500 line-clamp-2 mt-1">
${issue.description}
</p>

</div>


<!-- TAGS -->
<div class="flex gap-2 mt-3">

<span class="badge badge-error badge-outline">BUG</span>
<span class="badge badge-warning badge-outline">HELP WANTED</span>

</div>


<!-- AUTHOR -->
<div class="text-sm text-gray-400 mt-3">

#${issue.id} by ${issue.author}

<div class="text-xs text-gray-400 mt-1">

${new Date(issue.createdAt).toLocaleDateString()}
</div>
</div>

</div>
`

        issuesContainer.appendChild(card)

    })

}



// SEARCH
searchInput.addEventListener("keyup", () => {

    const text = searchInput.value.toLowerCase()

    const filtered = allIssues.filter(issue =>
        issue.title.toLowerCase().includes(text)
    )

    displayIssues(filtered)

})





function setActiveButton(activeBtn) {

    const buttons = [allBtn, openBtn, closedBtn]

    buttons.forEach(btn => {
        btn.classList.remove("btn-primary")
        btn.classList.add("btn-outline")
    })

    activeBtn.classList.add("btn-primary")
    activeBtn.classList.remove("btn-outline")

}
allBtn.onclick = () => {

    setActiveButton(allBtn)

    displayIssues(allIssues)

}
openBtn.onclick = () => {

    setActiveButton(openBtn)

    const openIssues = allIssues
        .filter(issue => issue.status.toUpperCase() === "OPEN")
        .slice(0, 20)

    displayIssues(openIssues)

}
closedBtn.onclick = () => {

    setActiveButton(closedBtn)

    const closedIssues = allIssues
        .filter(issue => issue.status.toUpperCase() === "CLOSED")
        .slice(0, 6)

    displayIssues(closedIssues)

}

// ISSUE MODAL
async function openIssue(id) {

    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)

    const data = await res.json()

    const issue = data.data

    document.getElementById("modalTitle").innerText = issue.title
    document.getElementById("modalDescription").innerText = issue.description

    document.getElementById("modalAuthor").innerText = issue.author
    document.getElementById("modalAuthor2").innerText = issue.author

    document.getElementById("modalDate").innerText = new Date(issue.created_at).toLocaleDateString()

    document.getElementById("modalPriority").innerText =
issue.priority.toUpperCase()

    document.getElementById("modalStatus").innerText = issue.status

    document.getElementById("issueModal").showModal()

}


loadIssues()

setActiveButton(allBtn)