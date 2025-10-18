package graph

import (
	"context"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct{}

func (r *Resolver) Query_hello(ctx context.Context) (string, error) {
	return "Hello, world!", nil
}

func (r *Resolver) Mutation_createItem(ctx context.Context, name string) (string, error) {
	return "Item created: " + name, nil
}
