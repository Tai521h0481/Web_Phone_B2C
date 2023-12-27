const base_url = "http://localhost:8080";

const get_all_users = base_url + "/users";

const displayUsers = async () => {
    const tableBody = document.getElementById("users-table-body");
    tableBody.innerHTML = "";
    fetch(get_all_users, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(data => {
        data.users.forEach(user => {
            const statusBadge = user.status === 'online'
                ? "bg-gradient-success"
                : "bg-gradient-secondary";
            
            const activeBadge = user.isActive
                ? "bg-gradient-success"
                : "bg-gradient-secondary";

            const lockBadge = user.isLocked
                ? "bg-gradient-danger"
                : "bg-gradient-success";
            const lockStatus = user.isLocked ? "Locked" : "Unlocked";
            const activeStatus = user.isActive ? "Active" : "Inactive";
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>
                    <div class="d-flex px-2 py-1">
                        <div>
                            <img src="${user.avatar}" class="avatar avatar-sm me-3" alt="avatar">
                        </div>
                        <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">${user.fullname}</h6>
                            <p class="text-xs text-secondary mb-0">${user.email}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <p class="text-xs font-weight-bold mb-0">${user.role}</p>
                    <p class="text-xs text-secondary mb-0">Department</p>
                </td>
                <td class="align-middle text-center text-sm">
                        <span class="badge badge-sm ${statusBadge}">${user.status}</span>
                </td>
                <td class="align-middle text-center text-sm">
                    <span class="badge badge-sm ${activeBadge}">${activeStatus}</span>
                </td>
                <td class="align-middle text-center text-sm">
                    <span class="badge badge-sm ${lockBadge}">${lockStatus}</span>
                </td>
                <td class="align-middle text-center">
                    <span class="text-secondary text-xs font-weight-bold">${new Date(
                        user.creationDate
                    ).toLocaleDateString()}</span>
                </td>
                <td class="align-middle">
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        ...
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li><a class="dropdown-item" href="javascript:;" data-user-id="${
                            user._id
                        }" onclick="viewDetail('${user._id}')">Detail</a></li>
                        <li><a class="dropdown-item" href="javascript:;" data-user-id="${
                            user._id
                        }" onclick="resendEmail('${user._id}')">Resend Email</a></li>
                        <li><a class="dropdown-item" href="javascript:;" data-user-id="${
                            user._id
                        }" onclick="handleDropdownItemClick(event, 'Lock/Unlock')">Lock/Unlock</a></li>
                    </ul>
                </td>
            `;
            tableBody.appendChild(row);
        });
    });
};

displayUsers();

const viewDetail = (userId) => {
    console.log("view detail" + userId);
};

const resendEmail = (userId) => {
    console.log("resend email" + userId);
};

const toggleLock = (userId) => {
    console.log("toggle lock" + userId);
}