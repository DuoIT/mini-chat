const socket = io("http://localhost:3000");

            socket.on("server-send-fail", function(){
                alert("Account_is_require!!");
            }); 

            socket.on("server-send-success", function(data){
                $("#currentUser").html(data);
                $("#loginForm").hide(1000);
                $("#chatForm").show(1000);
            });

            socket.on("server-send-all", function(data){
                $("#boxContent").html("");
                data.forEach(function(i){
                    $("#boxContent").append("<div class='user'>" + i + "</div>");
                });
            });

            socket.on("server-send-all", function(data){
            $("#boxContent").html("");
            data.forEach(function(i){
            $("#boxContent").append("<div class='user'>" + i + "</div>");
                });
            });

            socket.on("user-send-message", function(data){
            $("#contentMessage").append("<div class='ms' style='margin-bottom:20px'>"+" <span style='font-weight:bold'>" +data.un +"</span>"  + ":"+ " " + "<span style='background-color:#3578e5;border:1px solid #3578e5;padding:5px;border-radius:15px;color:white'>"+data.content+"</span>" +"</div>")
            });
            

            socket.on("one-person-is-typing", function(data){
                $("#istyping").html(data);
            });
            
            socket.on("one-person-stop-typing", function(){
                $("#istyping").html("");
            });

            $(document).ready(function(){
                $("#loginForm").show();
                $("#chatForm").hide();

                $("#btnSubmit").click(function(){
                    socket.emit("client-send-username", $("#txtUserName").val());
                });

                $("#btnLogout").click(function(){
                    socket.emit("logout");
                    $("#chatForm").hide(1000);
                    $("#loginForm").show(1000);
                });

                $("#txtUserName").keypress((event) => {
                    if(event.which === 13){
                    const message = $("#txtUserName").val();
                    if(message) 
                        {
                             socket.emit("client-send-username", message);
                             $("#txtUserName").val('');
                        }
                    }
                })

                $("#btnSendMessage").click(function(){
                    socket.emit("user-send-message", $("#txtMessage").val());
                });

                $("#txtMessage").keypress((event) => {
                    if(event.which === 13){
                    const message = $("#txtMessage").val();
                    if(message) 
                        {
                         socket.emit("user-send-message", message);
                         $("#txtMessage").val('');
                        }
                    }
                })

                $("#txtMessage").focusin(function(){
                    socket.emit("person-typing");
                });
                $("#txtMessage").focusout(function(){
                    socket.emit("person-stop-typing");
                });
            });