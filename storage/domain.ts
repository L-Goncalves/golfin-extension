let domainList: string[] = [];

export function loadDomainList(): string[] {
    const storedDomains = localStorage.getItem('domainList');
    domainList = storedDomains ? JSON.parse(storedDomains) : [];
    return domainList;
}

export function addToDomainListStorage(domain: string): void {
    if (domain && !domainList.includes(domain)) {
        domainList.push(domain);
        localStorage.setItem('domainList', JSON.stringify(domainList));
        console.log('Domain added:', domain);
    } else {
        console.log('Invalid domain or domain already in the list.');
    }
}

export function deleteFromDomainList(domain: string): void {
    const index = domainList.indexOf(domain);
    if (index !== -1) {
        domainList.splice(index, 1);
        localStorage.setItem('domainList', JSON.stringify(domainList));
        console.log('Domain deleted:', domain);
    } else {
        console.log('Domain not found.');
    }
}
