(* To allow CORS so that the frontend can fetch the video *)
let cors_middleware inner_handler req =
  Lwt.bind (inner_handler req) (fun res ->
    Dream.add_header res "Access-Control-Allow-Origin" "*";
    Dream.add_header res "Access-Control-Allow-Methods" "GET, HEAD, OPTIONS";
    Dream.add_header res "Access-Control-Allow-Headers" "Content-Type";
    Lwt.return res
  )

let () =
  Dream.run ~port:8080
  @@ Dream.logger
  @@ cors_middleware
  @@ Dream.router [
      (* endpoint que dá todos os filmes disponiveis. Usado para debug. *)
      Dream.get "/movielist" (fun _ ->
        let movies_dir = "./media/movies" in
        let files = Sys.readdir movies_dir in
        let movies_list = Array.to_list files |> String.concat "\n" in
        Dream.respond ~headers:["Content-Type", "text/plain"] movies_list
      );
      (* com as ** tudo o que vier depois de /media/ será servido como arquivo estático da diretoria media *)
       Dream.get "/media/movies/**" (Dream.static "./media/movies");
       Dream.get "/media/posters/**" (Dream.static "./media/posters");
       (* Servir o frontend Vite construído *)
       Dream.get "/**" (Dream.static "../frontend/dist");
     ]
