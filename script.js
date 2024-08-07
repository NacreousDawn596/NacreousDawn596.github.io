window.addEventListener("load", (le) => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    const sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) }
    let scroll = 0
    let circles = [10, -20, 30, -10]
    let _circles = [...circles]
    const dcircles = document.getElementsByClassName("rotating")[0].querySelectorAll("div")
    const arrow = document.getElementById("arrow")
    let angle = Math.PI
    arrow.style.transform = `rotate(${angle}rad)`
    let _fscroll = 0;
    const canvas = document.getElementById('idk_what_in_the_damn_world_is_this');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = 3 * window.innerHeight / 5;
    let wave = { y: canvas.height / 2, length: 0.01, amplitude: 10, frequency: 0.02 };
    let increment = wave.frequency;
    const terminalInput = document.getElementById("terminal-input");
    const terminalOutput = document.getElementById("terminal-output");
    const me = {
        name: "Aferiad Kamal",
        age: 17,
        location: "Morocco",
        interests: [
            "programming",
            "music",
            "gaming",
            "reading",
            "cooking"
        ],
        "skills": [
            "Mobile Dev",
            "FullStack Dev",
            "Desktop Dev",
            "AI dev"
        ]
    }
    dcircles.forEach((crcle, i) => {
        crcle.style.transform = `translate(-50%, -50%) rotate(${circles[i]}deg)`
    })
    for (const elemnt of ["topbar", "presentation", "aboutme", "generale"]) {
        document.getElementsByClassName(elemnt)[0].classList.toggle("fade")
    }
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        for (let i = 0; i < canvas.width; i++) {
            ctx.lineTo(i, wave.y + Math.sin(i * wave.length + increment) * wave.amplitude);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = 'rgb(23, 24, 43)';
        ctx.fill();
        increment += wave.frequency;
    }
    pleh = (hs) => {
        scroll += hs.deltaY
        document.getElementById("name").style.transform = scroll / 10 >= window.innerHeight ? "translateY(-10vh) translateX(-10vw)" : "translateY(0) translateX(-10vw)"
        if (scroll / 7.5 <= window.innerHeight) {
            hs.preventDefault()
            if (scroll < 0 && hs.deltaY > 0) {
                scroll = 0
                circles = [..._circles]
            }
            dcircles.forEach((crcle, i) => {
                angle = circles[i] * (((scroll) / 7.5 / window.innerHeight) - 1)
                crcle.style.transform = `translate(-50%, -50%) rotate(${-angle}deg)`
                _circles[i] = -angle % 180
            })
            _fscroll = scroll
        } else {
            n_scroll = scroll - _fscroll
            var dy = n_scroll - 2 * window.innerHeight / 3
            if (dy >= 0 && dy * window.innerWidth / window.innerHeight <= window.innerWidth) {
                const x = dy * window.innerWidth / window.innerHeight
                const y = window.innerHeight * Math.exp(-2 * x / window.innerWidth)
                angle = Math.PI / 2 + Math.atan(y / x)
                arrow.style.marginTop = `${window.innerHeight - y}px`
                arrow.style.marginLeft = `${x}px`
                arrow.style.transform = `rotate(${angle}rad)`
            }
        }

    }
    document.addEventListener("wheel", pleh, { passive: false })
    animate();
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = 3 * window.innerHeight / 5;
    });
    bleh = async () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && scroll != 0) {
            window.removeEventListener("wheel", pleh)
            window.removeEventListener("scroll", bleh)
            console.log('nvm I changed my mind about the design, I didn\'t like the light theme, I\'m transitionning to this dark one');
            for (const elemnt of ["header", "rotating", "idea"]) {
                await document.getElementsByClassName(elemnt)[0].classList.toggle("fade")
            }
            await sleep(1000)
            for (const elemnt of ["header", "rotating", "idea"]) {
                document.getElementsByClassName(elemnt)[0].style.display = "none"
            }
            for (const elemnt of ["topbar", "presentation", "aboutme", "generale"]) {
                document.getElementsByClassName(elemnt)[0].style.display = "flex"
                document.getElementsByClassName(elemnt)[0].classList.toggle("fade")
                await document.getElementsByClassName(elemnt)[0].classList.toggle("unfade")
            }
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            document.body.style.overflow = "hidden"
        }
    }
    window.addEventListener('scroll', bleh);

    document.getElementById("explore").addEventListener("click", (ev) => {
        document.body.style.overflow = "auto"
        window.scrollTo({
            top: window.innerHeight - window.innerHeight / 20,
            behavior: 'smooth'
        });
    })

    const files = {
        "Name.txt": "Kamal",
        "LastName.txt": "Aferiad",
        "Age.txt": me.age,
        "Country.txt": me.location,
        "Skills.json": JSON.stringify(me.skills, null, "\t"),
        "Interests.json": JSON.stringify(me.interests, null, "\t"),
        "Instagram.txt": "__definitely_not_me",
        "Discord.txt": "nacreousdawn596",
        "E-mail.txt": "aferiad.kamal@proton.me"
    }

    const commands = {
        help: "Supported commands: help, clear, echo [message], date, math [operation], ls, cat [file], neofetch, uname",
        clear: () => terminalOutput.innerHTML = "",
        echo: (args) => args.join(" "),
        date: () => new Date().toString(),
        math: (args) => {
            try {
                const result = eval(args.join(" "));
                return result.toString();
            } catch {
                return "Error: Invalid math operation";
            }
        },
        uname: () => `Linux Me 6.10.2-zen1-1-zen #1 ZEN SMP PREEMPT_DYNAMIC ${new Date().toString()} x86_64 GNU/Linux`,
        ls: (args) => args.join(" ") == '' ? Object.keys(files).join("      ") : args[0],
        cat: (args) => args.join(" ") == '' ? "cat: Error, no file provided" : Object.keys(files).indexOf(args[0]) >= 0 ? files[args[0]] : "cat: Error, file not found"
    }

    terminalInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const input = terminalInput.value.trim();
            const [command, ...args] = input.split(" ");
            handleCommand(command, args);
            terminalInput.value = "";
        }
    });
    const neofetch = {
        OS: "OS: Arch Linux x86_64",
        Host: "HP EliteBook x360 1030 G3 SBKPF",
        Shell: "zsh",
        Resolution: "1920x1080",
        DE: "GNOME",
        WM: "Mutter",
        "WM Theme": "Adwaita",
        Theme: "RosePine-Main-BL",
        Icons: "Adwaita",
        Terminal: "kitty",
        CPU: "Intel i5-8250U @ 3.4GHz",
        GPU: "Intel UHD Graphics 620",
        "GPU Driver": "Hewlett-Packard Company Device"
    }
    function handleCommand(command, args) {
        if (command in commands) {
            const output = typeof commands[command] === "function" ? commands[command](args) : commands[command];
            appendOutput(`❯ ${command} ${args.join(" ")}`);
            appendOutput(`${output}`);
        } else if (command === "neofetch") {
            appendOutput("❯ neofetch")
            const div = document.createElement("div");
            div.style.display = "flex";
            div.style.justifyContent = "center";
            div.style.alignItems = "center";
            div.style.width = "35vw";
            const imgdiv = document.createElement("div");
            imgdiv.style.width = "min(20vh, 20vw)";
            imgdiv.style.height = "min(20vh, 20vw)";
            imgdiv.style.display = "flex";
            imgdiv.style.justifyContent = "center";
            imgdiv.style.alignItems = "center";
            const img = document.createElement("img");
            img.src = "./archlinux.svg";
            img.alt = "archlinux image";
            imgdiv.appendChild(img); 
            div.appendChild(imgdiv); 
            const txtdiv = document.createElement("div");
            for (const key of Object.keys(neofetch)) {
                const tempdiv = document.createElement("div");
                const dh = document.createElement("span");
                dh.innerHTML = `${key}: `;
                dh.style.color = "green";
                tempdiv.appendChild(dh);
                tempdiv.innerHTML += `${neofetch[key]}`;
                txtdiv.appendChild(tempdiv);
            }
            div.appendChild(txtdiv);
            terminalOutput.appendChild(div);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;        
        } else {
            appendOutput(`❯ ${command} ${args.join(" ")}`)
            appendOutput(`${command}: command not found`);
        }
    }
    function appendOutput(text) {
        const div = document.createElement("div");
        div.textContent = text;
        terminalOutput.appendChild(div);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
})