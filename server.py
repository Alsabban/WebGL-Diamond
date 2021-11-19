import http.server
import socketserver

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
#Implement do_GET() to change path to the html file
    def do_GET(self):
        if self.path == '/':
            self.path = 'page.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

# Create an object of the above class
handler_object = MyHttpRequestHandler

PORT = 8000
my_server = socketserver.TCPServer(("", PORT), handler_object)
print("Running on port: "+str(PORT))

# Start the server
my_server.serve_forever()