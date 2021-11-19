import http.server
import socketserver

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
#Implement do_GET() to change path to the html file
    def do_GET(self):
        if self.path == '/':
            self.path = 'Part 2/page2.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

# Create an object of the above class
handler_object = MyHttpRequestHandler

PORT = 3000
my_server = socketserver.TCPServer(("", PORT), handler_object)
print("Running on port: "+str(PORT))

# Start the server
my_server.serve_forever()