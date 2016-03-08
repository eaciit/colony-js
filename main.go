package main

import (
	"github.com/eaciit/knot/knot.v1"
	"net/http"
	"os"
	"path"
	"runtime"
)

var (
	server *knot.Server
)

var (
	AppBasePath string = func(dir string, err error) string { return dir }(os.Getwd())
	LayoutFile  string = "views/layout.html"
)

func main() {
	runtime.GOMAXPROCS(4)

	knot.DefaultOutputType = knot.OutputTemplate
	server := new(knot.Server)
	server.Address = "localhost:3333"
	server.Register(new(ColonyController), "")
	server.RouteStatic("res", path.Join(AppBasePath, "assets"))
	server.Route("/", func(r *knot.WebContext) interface{} {
		http.Redirect(r.Writer, r.Request, "/colony/index", 301)
		return true
	})
	server.Listen()
}

type ColonyController struct {
}

func (c *ColonyController) Index(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputTemplate
	r.Config.LayoutTemplate = LayoutFile
	r.Config.ViewName = "views/lookup.html"

	return true
}

func (c *ColonyController) Grid(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputTemplate
	r.Config.LayoutTemplate = LayoutFile
	r.Config.ViewName = "views/grid.html"

	return true
}

func (c *ColonyController) DataBrowser(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputTemplate
	r.Config.LayoutTemplate = LayoutFile
	r.Config.ViewName = "views/databrowser.html"

	return true
}

func (c *ColonyController) QueryBuilder(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputTemplate
	r.Config.LayoutTemplate = LayoutFile
	r.Config.ViewName = "views/querybuilder.html"

	return true
}
